import {prisma } from "../config/prisma.config"

export class UserModel {
  async createUser(data: {
    username: string;
    email: string;
    password_hash: string;
    // profile_picture_url?: string; 
  }) {
    try {
      const newUser = await prisma.users.create({
        data,
      });
      return newUser;
    } catch (e: any) {
      if (e.code === 'P2002') {
        throw new Error('A user with this email or username already exists.');
      } else {
        throw e; // Re-throw other errors
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
  async updateUser(userId: string, data: Partial<{
    username: string;
    email: string;
    password_hash: string;
    // profile_picture_url?: string;
  }>) {
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
        throw e; // Re-throw other errors
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
