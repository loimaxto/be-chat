import { ApiError, ValidationError } from '../utils/errors';

function errorResponseHandler(err: Error, req: any, res: any, next: any) {
  console.error(`[Global Error Handler] Error: ${err.name} - ${err.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }
  // Default error response
  let statusCode = 500;
  let message = 'An unexpected error occurred.';
  let errors: any[] | undefined;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    if (err instanceof ValidationError) {
      errors = err.errors; // Include specific validation errors
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }), // Only include 'errors' array if it exists
  });
}

export default errorResponseHandler;
