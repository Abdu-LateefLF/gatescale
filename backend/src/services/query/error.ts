import AppError from '../../utils/error';

export class QueryError extends AppError {
    constructor(message: string) {
        super(`Query Error: ${message}`, 400);
    }
}

export class QueryParseError extends AppError {
    lineNumber: number;

    constructor(message: string, lineNumber: number) {
        super(message, 400);
        this.lineNumber = lineNumber;
    }
}

export class QuerySyntaxError extends AppError {
    constructor(message: string) {
        super(`Query Syntax Error: ${message}`, 400);
    }
}

export class QueryExecutionError extends AppError {
    lineNumber?: number;

    constructor(message: string, lineNumber?: number) {
        super(message, 400);
        this.lineNumber = lineNumber;
    }
}
