import { Request, Response, NextFunction } from 'express';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserService } from './user.service';
import { NotFoundError, UnauthorizedError } from '../../utils/errors';
import {
  isPasswordMatching,
  generateAuthToken,
} from '../../config/auth.config';

export class UserController {
  private userService = new UserService();

  public createUser = async (
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await this.userService.createUser(req.body);

      res.status(201).json({
        message: 'User created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  public loginUser = async (
    req: Request<any, any, LoginUserDto>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.getUserByEmail(email);
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
      await this.userService.updateUserStatus('online', user.user_id);

      res.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  public logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.params.id;
      if (!userId) {
        throw new NotFoundError('User ID is required for logout');
      }
      await this.userService.updateUserStatus('offline', userId);
      res.status(200).json({
        message: 'Logout successful',
      });
    } catch (e) {
      next(e);
    }
  }


  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);

      if (!user) throw new NotFoundError('User not found');

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  public getUsersByUsername = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username } = req.params;
      const users = await this.userService.getUsersByUsername(username);

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}
