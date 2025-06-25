import { Request, Response, NextFunction } from 'express';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserService } from './user.service';
import {
  generatePasswordHash,
  isPasswordMatching,
  generateAuthToken,
} from '../../config/auth.config';
import { UnauthorizedError } from '../../utils/errors';
const userService = new UserService();

export async function createUser(
  req: Request<{}, {}, CreateUserDto>,
  res: Response,
  next: NextFunction,
) {
  try {
    const { username, email, password } = req.body;
    const password_hash = await generatePasswordHash(password);
    const newUser = await userService.createUser({
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

    const passwordMatches = await isPasswordMatching(password, user.password_hash);
    
    if (!passwordMatches) {
      console.log("pass",user.password_hash, password)
      throw new UnauthorizedError('Wrong password');
    }

    const token = generateAuthToken(user.user_id, user.email, user.username);

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    next(error);
  }
}
