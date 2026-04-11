import Command from './command';
import { CommandType } from '../types';
import QueryContext from '../queryContext';
import { QueryParseError } from '../error';
import { isReservedKeyword } from '../reservedKeywords';

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
            if (!IDENT.test(name)) {
                throw new QueryParseError('Invalid identifier', lineNumber);
            }
            if (isReservedKeyword(name)) {
                throw new QueryParseError(
                    `Variable name ${name} is a reserved word`,
                    lineNumber
                );
            }
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
