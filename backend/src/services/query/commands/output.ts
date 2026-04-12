import Command from './command.js';
import { CommandType } from '../types.js';
import QueryContext from '../queryContext.js';
import { QueryParseError } from '../error.js';
import { isReservedKeyword } from '../reservedKeywords.js';

const IDENT = /^[a-zA-Z][a-zA-Z0-9_]*$/;

class OutputCommand extends Command {
    outputNames: string[] = [];

    constructor() {
        super(CommandType.OUTPUT);
    }

    parse(line: string, lineNumber: number): void {
        this.lineNumber = lineNumber;
        const m = line.match(/^OUTPUT\s+(.+)$/i);
        if (!m?.[1]) {
            throw new QueryParseError(
                'Invalid syntax in OUTPUT statement',
                lineNumber
            );
        }
        const names = m[1]
            .split(',')
            .map((s) => s.trim())
            .filter((s) => s.length > 0);

        if (names.length === 0) {
            throw new QueryParseError(
                'Invalid syntax in OUTPUT statement',
                lineNumber
            );
        }

        for (const name of names) {
            this.validateVariableName(name);
        }
        this.outputNames = names;
    }

    async execute(context: QueryContext): Promise<Record<string, unknown>> {
        const results: Record<string, unknown> = {};
        for (const name of this.outputNames) {
            const v = context.getVariable(name, this.lineNumber);
            results[name] = v.value;
        }
        return results;
    }
}

export default OutputCommand;
