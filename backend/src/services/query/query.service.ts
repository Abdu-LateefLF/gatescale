import QueryExecutor, { QueryExecutionResult } from './queryExecutor.js';

class QueryService {
    async executeQuery(query: string): Promise<QueryExecutionResult> {
        const executor = new QueryExecutor();
        const queryResult = await executor.executeQuery(query);
        return queryResult;
    }
}

const queryService = new QueryService();
export default queryService;
