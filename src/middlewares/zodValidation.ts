import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import { ValidationError } from '../utils/errors';
export const validateZod = (schema: ZodSchema) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            // Validate the request body against the schema
            schema.parse(req.body); // .parse() will throw an error if validation fails
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const formattedErrors = error.errors.map(err => ({
                    field: err.path.join('.'), // Join nested paths (e.g., "address.street")
                    message: err.message
                }));
                // console.log("text", formattedErrors);
                return next(new ValidationError('Input validation failed', formattedErrors));
            }
            next(error);
        }
    };