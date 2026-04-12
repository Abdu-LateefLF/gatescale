import Command from './commands/command.js';

export interface LexedLine {
    text: string;
    lineNumber: number;
}

export interface QueryLexerResult {
    lines: LexedLine[];
}


export interface QueryParserResult {
    commands: Command[];
}

export enum CommandType {
    SET = 'SET',
    CALCULATE = 'CALCULATE',
    ANALYZE = 'ANALYZE',
    FORECAST = 'FORECAST',
    SCORE = 'SCORE',
    ASSERT = 'ASSERT',
    OUTPUT = 'OUTPUT',
}

export type VariableType = 'string' | 'number' | 'boolean';

export interface Variable {
    name: string;
    value: any;
    type: VariableType;
}
