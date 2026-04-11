import { CommandType, Variable } from '../types';
import QueryContext from '../queryContext';

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
}

export default Command;
