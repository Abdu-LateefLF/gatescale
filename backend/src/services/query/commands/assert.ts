import Command from './command.js';
import { CommandType } from '../types.js';
import QueryContext from '../queryContext.js';
import { QueryExecutionError, QueryParseError } from '../error.js';
import { ExpressionParser, evaluateExpression } from '../expression.js';

type CompareOp = '>' | '<' | '>=' | '<=' | '==' | '!=';

/**
 * ASSERT <expression>
 *
 * Evaluates a boolean comparison. If false, execution stops with a structured error.
 * Supported operators: >, <, >=, <=, ==, !=
 * Each side is a numeric arithmetic expression.
 */
class AssertCommand extends Command {
    rawExpression = '';

    constructor() {
        super(CommandType.ASSERT);
    }

    parse(line: string, lineNumber: number): void {
        this.lineNumber = lineNumber;

        const m = line.match(/^ASSERT\s+(.+)$/i);
        if (!m?.[1]) {
            throw new QueryParseError(
                'Invalid syntax in ASSERT statement. Expected: ASSERT <expression>',
                lineNumber
            );
        }

        this.rawExpression = m[1].trim();

        if (!this.extractOp(this.rawExpression)) {
            throw new QueryParseError(
                `ASSERT expression must contain a comparison operator (>, <, >=, <=, ==, !=): "${this.rawExpression}"`,
                lineNumber
            );
        }
    }

    async execute(context: QueryContext): Promise<void> {
        const parsed = this.extractOp(this.rawExpression);
        if (!parsed) {
            throw new QueryExecutionError(
                `Invalid ASSERT expression: "${this.rawExpression}"`,
                this.lineNumber
            );
        }

        const { left, op, right } = parsed;

        let lVal: number;
        let rVal: number;

        try {
            const leftExpr = new ExpressionParser(left).parse();
            lVal = evaluateExpression(leftExpr, context, this.lineNumber);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new QueryExecutionError(
                `ASSERT left-hand side error: ${msg}`,
                this.lineNumber
            );
        }

        try {
            const rightExpr = new ExpressionParser(right).parse();
            rVal = evaluateExpression(rightExpr, context, this.lineNumber);
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            throw new QueryExecutionError(
                `ASSERT right-hand side error: ${msg}`,
                this.lineNumber
            );
        }

        const result = this.compare(lVal, op, rVal);

        if (!result) {
            throw new QueryExecutionError(
                `Assertion failed: ${this.rawExpression}`,
                this.lineNumber
            );
        }
    }

    private extractOp(
        expr: string
    ): { left: string; op: CompareOp; right: string } | null {
        const pattern = /^(.+?)\s*(>=|<=|==|!=|>|<)\s*(.+)$/;
        const m = expr.match(pattern);
        if (!m?.[1] || !m[2] || !m[3]) return null;
        return {
            left: m[1].trim(),
            op: m[2] as CompareOp,
            right: m[3].trim(),
        };
    }

    private compare(a: number, op: CompareOp, b: number): boolean {
        switch (op) {
            case '>':
                return a > b;
            case '<':
                return a < b;
            case '>=':
                return a >= b;
            case '<=':
                return a <= b;
            case '==':
                return a === b;
            case '!=':
                return a !== b;
        }
    }
}

export default AssertCommand;
