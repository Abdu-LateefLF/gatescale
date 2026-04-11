class AppError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class AuthenticationError extends AppError {
    constructor(message: string) {
        super(`Authentication Error: ${message}`, 401);
    }
}

export class BadRequestError extends AppError {
    constructor(message: string) {
        super(`Bad Request: ${message}`, 400);
    }
}

export class NotFoundError extends AppError {
    constructor(message: string) {
        super(`Not Found: ${message}`, 404);
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(`Validation Error: ${message}`, 422);
    }
}

export class InternalServerError extends AppError {
    constructor(message: string) {
        super(`Internal Server Error: ${message}`, 500);
    }
}

export default AppError;
