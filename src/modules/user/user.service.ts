import { prisma } from "../../config/prisma.config";
import { CreateUserDto } from "./user.dto";
import { generatePasswordHash } from "../../config/auth.config";
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
      if (e.code === "P2002") {
        throw new Error("A user with this email or username already exists.");
      } else {
        throw e;
      }
    }
  }
  async getUserByEmail(email: string) {
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
        select: {
          user_id: true,
          username: true,
          email: true,
          status: true,
          last_seen_at: true,
          profile_picture_url: true, // Assuming this field exists
        },
      });
      return user;
    } catch (e: any) {
      throw e;
    }
  }
  async getUsersByUsername(username: string) {
    try {
      const users = await prisma.users.findMany({
        where: {
          username: {
            contains: username,
            mode: "insensitive",
          },
        },
        select: {
          user_id: true,
          username: true,
          status: true,
          last_seen_at: true,
          profile_picture_url: true, // Assuming this field exists
        },
      });
      return users;
    } catch (e: any) {
      throw new Error("user not found");
    }
  }
  
  async updateUser(
    userId: string,
    data: Partial<{
      username: string;
      email: string;
      password_hash: string;
      // profile_picture_url?: string;
    }>
  ) {
    try {
      const updatedUser = await prisma.users.update({
        where: { user_id: userId },
        data,
      });
      return updatedUser;
    } catch (e: any) {
      if (e.code === "P2002") {
        throw new Error("A user with this email or username already exists.");
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
  async updateUserStatus(status: "online" | "offline", userId: string) {
    try {
      if (status == "offline") {
        await prisma.users.update({
          where: { user_id: userId },
          data: { status: status, last_seen_at: new Date() },
        });
      } else {
        await prisma.users.update({
          where: { user_id: userId },
          data: { status: status },
        });
      }
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
