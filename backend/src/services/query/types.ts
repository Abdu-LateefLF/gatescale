import Command from './commands/command.js';

export interface LexedLine {
    text: string;
    lineNumber: number;
}

export interface QueryLexerResult {
    lines: LexedLine[];
}

export type Expression =
    | { kind: 'number'; value: number }
    | { kind: 'ident'; name: string }
    | {
          kind: 'binary';
          op: '+' | '-' | '*' | '/';
          left: Expression;
          right: Expression;
      };

export interface QueryParserResult {
    commands: Command[];
}

export enum CommandType {
    SET = 'SET',
    CALCULATE = 'CALCULATE',
    ANALYZE = 'ANALYZE',
    OUTPUT = 'OUTPUT',
}

export type VariableType = 'string' | 'number' | 'boolean';

export interface Variable {
    name: string;
    value: any;
    type: VariableType;
}
