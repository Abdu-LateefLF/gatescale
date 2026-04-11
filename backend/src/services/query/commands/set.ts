import Command from './command';
import { CommandType, VariableType } from '../types';
import QueryContext from '../queryContext';
import { QueryParseError } from '../error';
import { isReservedKeyword } from '../reservedKeywords';

const IDENT = /^[a-zA-Z][a-zA-Z0-9_]*$/;

class SetCommand extends Command {
    constructor() {
        super(CommandType.SET);
    }

    parse(line: string, lineNumber: number): void {
        this.lineNumber = lineNumber;
        const m = line.match(/^SET\s+([a-zA-Z][a-zA-Z0-9_]*)\s*=\s*(.+)$/i);
        if (!m?.[1] || m[2] === undefined) {
            throw new QueryParseError(
                'Invalid syntax in SET statement',
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
        this.value = m[2].trim();
    }

    async execute(context: QueryContext): Promise<void> {
        const { type, value } = this.parseLiteral(this.value!, this.lineNumber);
        context.setVariable(this.variable!, {
            name: this.variable!,
            value,
            type,
        });
    }

    private parseLiteral(
        rawLiteral: string,
        lineNumber: number
    ): { type: VariableType; value: string | number | boolean } {
        if (rawLiteral.length === 0) {
            throw new QueryParseError('Value is required', lineNumber);
        }

        if (rawLiteral.startsWith('"')) {
            if (!rawLiteral.endsWith('"') || rawLiteral.length < 2) {
                throw new QueryParseError('Invalid string literal', lineNumber);
            }
            const inner = rawLiteral.slice(1, -1);
            return { type: 'string', value: inner };
        }

        if (/^true$/i.test(rawLiteral)) {
            return { type: 'boolean', value: true };
        }
        if (/^false$/i.test(rawLiteral)) {
            return { type: 'boolean', value: false };
        }

        if (/^\d+(\.\d+)?$/.test(rawLiteral)) {
            return { type: 'number', value: Number(rawLiteral) };
        }

        throw new QueryParseError('Invalid value type', lineNumber);
    }
}

export default SetCommand;
