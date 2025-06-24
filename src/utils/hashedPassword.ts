import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function generatePasswordHash(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync();
    return bcrypt.hash(password, salt);
}

export function isPasswordMatching(plainPassword: string, hashPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashPassword); 
}

// It's highly recommended to use an environment variable for your JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-and-long-key-that-is-at-least-32-chars';

export function generateAuthToken(userId: string, email: string): string {
  const payload = {
    sub: userId, // 'sub' (subject) is a standard JWT claim
    email,
  };
  // Token expires in 1 hour. You can adjust this.
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
}

export function verifyAuthToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null; // Token is invalid or expired
  }
}