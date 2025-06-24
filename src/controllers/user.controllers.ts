import { Request, Response, NextFunction } from 'express';
import { CreateUserDto, LoginUserDto } from '../dtos/user.dto';
import { UserModel } from '../models/user.model';
import {
  generatePasswordHash,
  isPasswordMatching,
  generateAuthToken,
} from '../utils/hashedPassword';
import { UnauthorizedError } from '../utils/errors';
const userModel = new UserModel();

export async function createUser(
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, email, password } = req.body;
    const password_hash = await generatePasswordHash(password);
    const newUser = await userModel.createUser({
      username,
      email,
      password_hash,
    });

    const { password_hash: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User created successfully',
      data: userWithoutPassword,
    });
  } catch (error) {
    // Pass errors to the global error handler
    next(error);
  }
}

export async function loginUser(
  req: Request<any, any, LoginUserDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { email, password } = req.body;

    const user = await userModel.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('No user found with this email');
    }

    const passwordMatches = await isPasswordMatching(password, user.password_hash);
    if (!passwordMatches) {
      console.log("pass",user.password_hash, password)
    }

    const token = generateAuthToken(user.user_id, user.email);

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    next(error);
  }
}
