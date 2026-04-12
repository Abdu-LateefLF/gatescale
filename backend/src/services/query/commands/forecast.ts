import Command from './command.js';
import { CommandType, VariableType } from '../types.js';
import QueryContext from '../queryContext.js';
import { QueryExecutionError, QueryParseError } from '../error.js';

/**
 * FORECAST <identifier> USING <identifier_list> FOR <number> YEARS
 *
 * v1: compound growth — result = principal * (1 + rate)^years
 * identifier_list must supply: principal, rate (in that order)
 */
class ForecastCommand extends Command {
    targetName = '';
    sourceNames: string[] = [];
    years = 0;

    constructor() {
        super(CommandType.FORECAST);
    }

    parse(line: string, lineNumber: number): void {
        this.lineNumber = lineNumber;

        const m = line.match(
            /^FORECAST\s+([a-zA-Z][a-zA-Z0-9_]*)\s+USING\s+(.+?)\s+FOR\s+(\d+(?:\.\d+)?)\s+YEARS$/i
        );

        if (!m?.[1] || !m[2] || !m[3]) {
            throw new QueryParseError(
                'Invalid syntax in FORECAST statement. Expected: FORECAST <name> USING <vars> FOR <n> YEARS',
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
                'FORECAST USING requires at least two variables: principal and rate',
                lineNumber
            );
        }

        for (const name of names) {
            this.validateVariableName(name);
        }
        this.sourceNames = names;

        const years = Number(m[3]);
        if (!Number.isFinite(years) || years <= 0) {
            throw new QueryParseError(
                'FORECAST years must be a positive number',
                lineNumber
            );
        }
        this.years = years;
    }

    async execute(context: QueryContext): Promise<void> {
        const principalVar = context.getVariable(
            this.sourceNames[0]!,
            this.lineNumber
        );
        const rateVar = context.getVariable(
            this.sourceNames[1]!,
            this.lineNumber
        );

        if (principalVar.type !== 'number') {
            throw new QueryExecutionError(
                `FORECAST: variable "${this.sourceNames[0]}" must be a number`,
                this.lineNumber
            );
        }
        if (rateVar.type !== 'number') {
            throw new QueryExecutionError(
                `FORECAST: variable "${this.sourceNames[1]}" must be a number`,
                this.lineNumber
            );
        }

        const principal = principalVar.value as number;
        const rate = rateVar.value as number;

        const result =
            Math.round(principal * Math.pow(1 + rate, this.years) * 100) / 100;

        context.setVariable(this.targetName, {
            name: this.targetName,
            value: result,
            type: 'number' as VariableType,
        });
    }
}

export default ForecastCommand;
