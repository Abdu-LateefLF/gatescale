import QueryContext from './queryContext';
import queryLexer from './queryLexer';
import queryParser from './queryParser';
import { CommandType } from './types';

export interface QueryExecutionResult {
    results: Record<string, unknown>;
    executionTimeMs: number;
}

class QueryExecutor {
    async executeQuery(query: string): Promise<QueryExecutionResult> {
        const started = Date.now();

        const context = new QueryContext();
        const lexerResult = await queryLexer.lexQuery(query);
        const parserResult = await queryParser.parseQuery(lexerResult.lines);

        let results: Record<string, unknown> = {};

        for (const command of parserResult.commands) {
            if (command.type === CommandType.OUTPUT) {
                results = await command.execute(context);
                break;
            }
            await command.execute(context);
        }

        return {
            results,
            executionTimeMs: Date.now() - started,
        };
    }
}

export default QueryExecutor;
