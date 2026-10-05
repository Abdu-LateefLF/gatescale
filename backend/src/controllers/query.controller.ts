import { Request, Response } from 'express';
import queryService from '../services/query/query.service.ts';
import { RunQueryRequest } from '../schemas/query.schema.ts';

class QueryController {
    async run(req: Request, res: Response) {
        const { query } = req.body as RunQueryRequest;
        const result = await queryService.executeQuery(query);
        res.json(result);
    }
}

const queryController = new QueryController();
export default queryController;
