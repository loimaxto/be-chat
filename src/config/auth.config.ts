import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export function generatePasswordHash(password: string): Promise<string> {
  const salt = bcrypt.genSaltSync();
    return bcrypt.hash(password, salt);
}

export function isPasswordMatching(plainPassword: string, hashPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashPassword); 
}

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || 'default_secrete_key';

export function generateAuthToken(userId: string, email: string, username: string): string {
  const payload = {
    sub: userId,
    username,
    email,
  };
  console.log("acessb", ACCESS_TOKEN_SECRET)
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
}

export function verifyAuthToken(token: string) {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}