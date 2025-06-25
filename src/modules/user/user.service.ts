import { prisma } from '../../config/prisma.config';
import { CreateUserDto } from './user.dto';
import { generatePasswordHash } from '../../config/auth.config';
export class UserService {
  async createUser(data: CreateUserDto) {
    try {
      const password_hash = await generatePasswordHash(data.password);

      const newUser = await prisma.users.create({
        data: {
          username: data.username,
          email: data.email,
          password_hash: password_hash,
        },
      });
      return newUser;
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new Error('A user with this email or username already exists.');
      } else {
        throw e;
      }
    }
  }
  async findUserByEmail(email: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { email },
      });
      return user;
    } catch (e: any) {
      throw e;
    }
  }
  async getAllUsers() {
    try {
      const users = await prisma.users.findMany();
      return users;
    } catch (e: any) {
      throw e;
    }
  }
  async getUserById(userId: string) {
    try {
      const user = await prisma.users.findUnique({
        where: { user_id: userId },
      });
      return user;
    } catch (e: any) {
      throw e;
    }
  }
  async updateUser(
    userId: string,
    data: Partial<{
      username: string;
      email: string;
      password_hash: string;
      // profile_picture_url?: string;
    }>,
  ) {
    try {
      const updatedUser = await prisma.users.update({
        where: { user_id: userId },
        data,
      });
      return updatedUser;
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new Error('A user with this email or username already exists.');
      } else {
        throw e;
      }
    }
  }
  async deleteUser(userId: string) {
    try {
      const deletedUser = await prisma.users.delete({
        where: { user_id: userId },
      });
      return deletedUser;
    } catch (e: any) {
      throw e;
    }
  }
  // async getConversations(userId: string) {
  //   try {
  //     const conversations = await prisma.conversation_participants.findMany({
  //       where: { user_id:userId },
  //       include: {

  //       },
  //     });
  //     return friends.map(friend => friend.friend);
  //   } catch (e: any) {
  //     throw e;
  //   }
  // }
}
