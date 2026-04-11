import Command from './command';
import { CommandType, Expression, VariableType } from '../types';
import QueryContext from '../queryContext';
import { QueryParseError } from '../error';
import { isReservedKeyword } from '../reservedKeywords';
import { ExpressionParser, evaluateExpression } from '../expression';

const IDENT = /^[a-zA-Z][a-zA-Z0-9_]*$/;

class CalculateCommand extends Command {
    expr?: Expression;

    constructor() {
        super(CommandType.CALCULATE);
    }

    parse(line: string, lineNumber: number): void {
        this.lineNumber = lineNumber;
        const m = line.match(
            /^CALCULATE\s+([a-zA-Z][a-zA-Z0-9_]*)\s*=\s*(.+)$/i
        );

        if (!m?.[1] || m[2] === undefined) {
            throw new QueryParseError(
                'Invalid syntax in CALCULATE statement',
                lineNumber
            );
        }

        this.variable = m[1];

        if (isReservedKeyword(this.variable)) {
            throw new QueryParseError(
                `Variable name ${this.variable} is a reserved word`,
                lineNumber
            );
        }

        if (!IDENT.test(this.variable)) {
            throw new QueryParseError('Invalid identifier', lineNumber);
        }

        const exprSource = m[2].trim();

        try {
            this.expr = new ExpressionParser(exprSource).parse();
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Invalid expression';
            throw new QueryParseError(
                `Invalid syntax in CALCULATE statement (${msg})`,
                lineNumber
            );
        }
    }

    async execute(context: QueryContext): Promise<void> {
        const value = evaluateExpression(this.expr!, context, this.lineNumber);
        context.setVariable(this.variable!, {
            name: this.variable!,
            value,
            type: 'number' as VariableType,
        });
    }
}

export default CalculateCommand;
