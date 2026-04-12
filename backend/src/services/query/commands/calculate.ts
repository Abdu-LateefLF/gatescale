import Command from './command.js';
import { CommandType, Expression, VariableType } from '../types.js';
import QueryContext from '../queryContext.js';
import { QueryParseError } from '../error.js';
import { ExpressionParser, evaluateExpression } from '../expression.js';

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

        this.validateVariableName(this.variable);

        const exprSource = m[2].trim();

        try {
            this.expr = new ExpressionParser(exprSource).parse();
        } catch (error) {
            const msg =
                error instanceof Error ? error.message : 'Invalid expression';
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
