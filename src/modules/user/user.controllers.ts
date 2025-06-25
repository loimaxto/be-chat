import { Request, Response, NextFunction } from 'express';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserService } from './user.service';
import { UnauthorizedError } from '../../utils/errors';
import {
  isPasswordMatching,
  generateAuthToken,
} from '../../config/auth.config';

const userService = new UserService();

export async function createUser(
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const newUser = await userService.createUser(req.body);

    res.status(201).json({
      message: 'User created successfully',
    });
  } catch (error) {
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

    const user = await userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedError('No user found with this email');
    }

    const passwordMatches = await isPasswordMatching(
      password,
      user.password_hash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedError('Wrong password');
    }

    const token = generateAuthToken(user.user_id, user.email, user.username);

    res.status(201).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    next(error);
  }
}
