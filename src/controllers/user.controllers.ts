import { Request, Response, NextFunction } from 'express';
import { PrismaClient, users } from '@prisma/client';
import { CreateUserDto } from '../dtos/user.dto';
export const createUser1 = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email } = req.body;
    // Here you would typically save the user to a database
    const newUser = { id: Date.now(), username, email };
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
};

export async function createUser(
  req: Request<any, any, CreateUserDto>,
  res: Response,
  next: NextFunction
) {
  // const prisma = new PrismaClient();
  try {
    console.log('data received', req.body);
    // console.log("body", req)
    // const { username, email } = req.body;

    // const user = await prisma.users.create({
    //   data: {
    //     username,
    //     email,
    //   },
    // });

    // throw new Error('This is a test error', ); // Simulating an error for testing purposes
    res.status(201).json({
      message: 'User created successfully',
      data: {
        id: 1,
        email: req.body.email
      }
    });
    console.log(`[UserController] Responded with 201 for user: email`);
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
