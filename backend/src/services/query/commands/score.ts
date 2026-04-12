import Command from './command.js';
import { CommandType, VariableType } from '../types.js';
import QueryContext from '../queryContext.js';
import { QueryExecutionError, QueryParseError } from '../error.js';

/**
 * SCORE <identifier> USING <identifier_list>
 *
 * v1 rule: score = (vars[0] / vars[1]) * 100, clamped to [0, 100].
 * Requires at least two numeric variables: numerator and denominator.
 */
class ScoreCommand extends Command {
    targetName = '';
    sourceNames: string[] = [];

    constructor() {
        super(CommandType.SCORE);
    }

    parse(line: string, lineNumber: number): void {
        this.lineNumber = lineNumber;

        const m = line.match(
            /^SCORE\s+([a-zA-Z][a-zA-Z0-9_]*)\s+USING\s+(.+)$/i
        );

        if (!m?.[1] || !m[2]) {
            throw new QueryParseError(
                'Invalid syntax in SCORE statement. Expected: SCORE <name> USING <vars>',
                lineNumber
            );
        }

        this.targetName = m[1];
        this.validateVariableName(this.targetName);

        const names = m[2]
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        if (names.length < 2) {
            throw new QueryParseError(
                'SCORE USING requires at least two variables',
                lineNumber
            );
        }

        for (const name of names) {
            this.validateVariableName(name);
        }
        this.sourceNames = names;
    }

    async execute(context: QueryContext): Promise<void> {
        const numeratorVar = context.getVariable(
            this.sourceNames[0]!,
            this.lineNumber
        );
        const denominatorVar = context.getVariable(
            this.sourceNames[1]!,
            this.lineNumber
        );

        if (numeratorVar.type !== 'number') {
            throw new QueryExecutionError(
                `SCORE: variable "${this.sourceNames[0]}" must be a number`,
                this.lineNumber
            );
        }
        if (denominatorVar.type !== 'number') {
            throw new QueryExecutionError(
                `SCORE: variable "${this.sourceNames[1]}" must be a number`,
                this.lineNumber
            );
        }

        const numerator = numeratorVar.value as number;
        const denominator = denominatorVar.value as number;

        if (denominator === 0) {
            throw new QueryExecutionError(
                'SCORE: division by zero — denominator variable is 0',
                this.lineNumber
            );
        }

        const raw = (numerator / denominator) * 100;
        const score = Math.round(Math.min(100, Math.max(0, raw)));

        context.setVariable(this.targetName, {
            name: this.targetName,
            value: score,
            type: 'number' as VariableType,
        });
    }
}

export default ScoreCommand;
