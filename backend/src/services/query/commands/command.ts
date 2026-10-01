import { CommandType, Variable } from '../types';
import QueryContext from '../queryContext';
import { QueryParseError } from '../error';
import { isReservedKeyword } from '../reservedKeywords';

abstract class Command {
    type: CommandType;
    lineNumber = 1;
    variable?: string;
    variables?: string[];
    arguments?: string[];
    value?: string;
    expression?: string;

    constructor(type: CommandType) {
        this.type = type;
    }

    abstract parse(line: string, lineNumber: number): void;
    abstract execute(context: QueryContext): Promise<any>;

    validateVariableName(name: string): void {
        if (!/^[a-zA-Z][a-zA-Z0-9_]*$/i.test(name)) {
            throw new QueryParseError('Invalid variable name', this.lineNumber);
        }
        if (isReservedKeyword(name.toUpperCase())) {
            throw new QueryParseError(
                `Variable name "${name}" is a reserved word`,
                this.lineNumber
            );
        }
    }
}

export default Command;
