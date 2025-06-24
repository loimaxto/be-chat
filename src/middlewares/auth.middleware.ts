import { Request, Response, NextFunction } from 'express';
import { verifyAuthToken } from '../utils/hashedPassword';
import { UnauthorizedError } from '../utils/errors';

// By using declaration merging, we can add a 'user' property to Express's Request type.
// This provides type safety for the authenticated user's payload.
declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email: string;
      };
    }
  }
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return next(new UnauthorizedError('No token provided'));
  }

  const payload = verifyAuthToken(token) as { sub: string, email: string } | null;

  if (!payload) return next(new UnauthorizedError('Invalid or expired token'));

  req.user = payload;
  next();
}