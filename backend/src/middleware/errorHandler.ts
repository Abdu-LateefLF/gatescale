import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/error.js';
import { QueryExecutionError, QueryParseError } from '../services/query/error.js';

function errorHandler(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (err instanceof AppError) {
        const body: { error: string; line?: number } = { error: err.message };
        if (err instanceof QueryParseError) {
            body.line = err.lineNumber;
        } else if (
            err instanceof QueryExecutionError &&
            err.lineNumber !== undefined
        ) {
            body.line = err.lineNumber;
        }
        return res.status(err.statusCode).json(body);
    }

    console.error('Unexpected error:', err);
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
}

export default errorHandler;
