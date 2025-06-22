// src/utils/errors.ts

/**
 * @class ApiError
 * @extends Error
 * @description Base custom error class for API-related errors.
 * Allows attaching an HTTP status code to the error.
 */
export class ApiError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number = 500) {
        super(message); // Call the parent Error constructor
        this.name = 'ApiError'; // Set the name for easier identification
        this.statusCode = statusCode; // Custom status code
        // This ensures the correct prototype chain for 'instanceof' checks
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}

/**
 * @class NotFoundError
 * @extends ApiError
 * @description Specific error for when a resource is not found (HTTP 404).
 */
export class NotFoundError extends ApiError {
    constructor(message: string = 'Resource not found') {
        super(message, 404);
        this.name = 'NotFoundError';
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}

/**
 * @class BadRequestError
 * @extends ApiError
 * @description Specific error for bad requests due to client input (HTTP 400).
 */
export class BadRequestError extends ApiError {
    constructor(message: string = 'Bad request') {
        super(message, 400);
        this.name = 'BadRequestError';
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
}

/**
 * @class ValidationError
 * @extends ApiError
 * @description Specific error for validation failures (HTTP 400),
 * allowing detailed validation errors to be passed.
 */
export class ValidationError extends ApiError {
    public readonly errors: any[]; // Can be an array of specific validation errors

    constructor(message: string = 'Validation failed', errors: any[] = []) {
        super(message, 400);
        this.name = 'ValidationError';
        this.errors = errors;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}

/**
 * @class UnauthorizedError
 * @extends ApiError
 * @description Specific error for authentication failures (HTTP 401).
 */
export class UnauthorizedError extends ApiError {
    constructor(message: string = 'Authentication required') {
        super(message, 401);
        this.name = 'UnauthorizedError';
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
}

/**
 * @class ForbiddenError
 * @extends ApiError
 * @description Specific error for authorization failures (HTTP 403).
 */
export class ForbiddenError extends ApiError {
    constructor(message: string = 'Access forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
}
