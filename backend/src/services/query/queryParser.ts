import type Command from './commands/command.js';
import SetCommand from './commands/set.js';
import CalculateCommand from './commands/calculate.js';
import AnalyzeCommand from './commands/analyze.js';
import ForecastCommand from './commands/forecast.js';
import ScoreCommand from './commands/score.js';
import AssertCommand from './commands/assert.js';
import OutputCommand from './commands/output.js';
import { QueryParseError } from './error.js';
import { CommandType, LexedLine, QueryParserResult } from './types.js';

class QueryParser {
    async parseQuery(lines: LexedLine[]): Promise<QueryParserResult> {
        const commands: Command[] = [];

        for (const { text, lineNumber } of lines) {
            try {
                const command = this.parseLine(text.trim(), lineNumber);
                commands.push(command);
            } catch (error) {
                if (error instanceof QueryParseError) {
                    throw error;
                }
                const msg =
                    error instanceof Error ? error.message : String(error);
                throw new QueryParseError(
                    `Error parsing line ${lineNumber}: ${msg}`,
                    lineNumber
                );
            }
        }

        this.validateOutputRules(commands);

        return { commands };
    }

    private validateOutputRules(commands: Command[]): void {
        const outputIndices = commands
            .map((c, i) => (c.type === CommandType.OUTPUT ? i : -1))
            .filter((i) => i >= 0);

        if (outputIndices.length > 1) {
            const line = commands[outputIndices[1]!]!.lineNumber;
            throw new QueryParseError(
                'Only one OUTPUT statement is allowed',
                line
            );
        }

        if (
            outputIndices.length === 1 &&
            outputIndices[0] !== commands.length - 1
        ) {
            const line = commands[outputIndices[0]!]!.lineNumber;
            throw new QueryParseError(
                'OUTPUT must be the final statement',
                line
            );
        }
    }

    private parseLine(line: string, lineNumber: number): Command {
        const head = line.match(/^\s*([^\s]+)/)?.[1] ?? '';
        const keyword = head.toUpperCase();

        let command: Command;
        switch (keyword) {
            case 'SET':
                command = new SetCommand();
                break;
            case 'CALCULATE':
                command = new CalculateCommand();
                break;
            case 'ANALYZE':
                command = new AnalyzeCommand();
                break;
            case 'FORECAST':
                command = new ForecastCommand();
                break;
            case 'SCORE':
                command = new ScoreCommand();
                break;
            case 'ASSERT':
                command = new AssertCommand();
                break;
            case 'OUTPUT':
                command = new OutputCommand();
                break;
            default:
                throw new QueryParseError(
                    `"${head || '(empty)'}" is not a valid command. Valid commands: SET, CALCULATE, ANALYZE, FORECAST, SCORE, ASSERT, OUTPUT`,
                    lineNumber
                );
        }

        command.parse(line, lineNumber);
        return command;
    }
}

const queryParser = new QueryParser();
export default queryParser;
