import Command from './command';
import { CommandType, VariableType } from '../types';
import QueryContext from '../queryContext';
import { QueryExecutionError, QueryParseError } from '../error';
import { isReservedKeyword } from '../reservedKeywords';

const IDENT = /^[a-zA-Z][a-zA-Z0-9_]*$/;

/**
 * v1 rule-based ANALYZE: maps a savings rate to Strong / Stable / At Risk (FinQL.md).
 */
class AnalyzeCommand extends Command {
    targetName = '';
    sourceNames: string[] = [];

    constructor() {
        super(CommandType.ANALYZE);
    }

    parse(line: string, lineNumber: number): void {
        this.lineNumber = lineNumber;
        const m = line.match(
            /^ANALYZE\s+([a-zA-Z][a-zA-Z0-9_]*)\s+USING\s+(.+)$/i
        );

        if (!m?.[1] || !m[2]) {
            throw new QueryParseError(
                'Invalid syntax in ANALYZE statement',
                lineNumber
            );
        }

        this.targetName = m[1];
        this.validateVariableName(this.targetName);

        const names = m[2]
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        if (names.length === 0) {
            throw new QueryParseError(
                'Invalid syntax in ANALYZE statement',
                lineNumber
            );
        }

        for (const name of names) {
            this.validateVariableName(name);
        }
        this.sourceNames = names;
    }

    async execute(context: QueryContext): Promise<void> {
        for (const name of this.sourceNames) {
            context.getVariable(name, this.lineNumber);
        }

        const savingsRate = this.resolveSavingsRate(context);

        let label: string;
        if (savingsRate >= 0.2) {
            label = 'Strong';
        } else if (savingsRate >= 0.1) {
            label = 'Stable';
        } else {
            label = 'At Risk';
        }

        context.setVariable(this.targetName, {
            name: this.targetName,
            value: label,
            type: 'string' as VariableType,
        });
    }

    private resolveSavingsRate(context: QueryContext): number {
        if (this.sourceNames.length >= 2) {
            const a = context.getVariable(
                this.sourceNames[0]!,
                this.lineNumber
            );
            const b = context.getVariable(
                this.sourceNames[1]!,
                this.lineNumber
            );

            if (a.type !== 'number' || b.type !== 'number') {
                throw new QueryExecutionError(
                    'ANALYZE USING variables must be numbers',
                    this.lineNumber
                );
            }

            const num = a.value as number;
            const den = b.value as number;

            if (den === 0) {
                throw new QueryExecutionError(
                    'Division by zero',
                    this.lineNumber
                );
            }
            return num / den;
        }

        const only = context.getVariable(this.sourceNames[0]!, this.lineNumber);

        if (only.type !== 'number') {
            throw new QueryExecutionError(
                'ANALYZE USING variable must be a number',
                this.lineNumber
            );
        }
        return only.value as number;
    }
}

export default AnalyzeCommand;
