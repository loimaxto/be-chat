import { Request, Response, NextFunction } from 'express';
import { CreateUserDto, LoginUserDto } from './user.dto';
import { UserService } from './user.service';
import { UnauthorizedError } from '../../utils/errors';
import {
  isPasswordMatching,
  generateAuthToken,
} from '../../config/auth.config';

export class UserController {
  private readonly userService = new UserService();

  // --- Creation ---
  public async createUser(
    req: Request<{}, {}, CreateUserDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      // The service returns the new user, which is a good practice
      const newUser = await this.userService.createUser(req.body);

      // Respond with the new user object and a 201 status
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  // --- Authentication ---
  public async loginUser(
    req: Request<any, any, LoginUserDto>,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      // The service layer handles the "user not found" case gracefully.
      const user = await this.userService.getUserByEmail(email);

      // Check if user exists and password matches
      if (!user || !(await isPasswordMatching(password, user.password_hash))) {
        throw new UnauthorizedError('Invalid email or password');
      }

      const token = generateAuthToken(user.user_id, user.email, user.username);

      // Update user status
      await this.userService.updateUserStatus('online', user.user_id);

      res.status(200).json({
        message: 'Login successful',
        token,
      });
    } catch (error) {
      next(error);
    }
  }

  public async logoutUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.sub as string;
      
      if( !userId) {
        throw new UnauthorizedError('Is not login yet!');
      }
      // The service layer will handle the case where the user ID is invalid
      await this.userService.updateUserStatus('offline', userId);
      
      res.status(200).json({
        message: 'Logout successful',
      });
    } catch (e) {
      next(e);
    }
  }

  // --- Retrieval ---
  public async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      
      // The service layer throws a NotFoundError, so no check is needed here
      const user = await this.userService.getUserById(id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  public async getUsersByUsername(req: Request  , res: Response, next: NextFunction): Promise<void> {
    try {
      const username = req.query.username as string;
      const users = await this.userService.getUsersByUsername(username);

      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}