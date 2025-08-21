import { generatePasswordHash } from "../../config/auth.config";
import { prisma } from "../../config/prisma.config";
import { NotFoundError } from "../../utils/errors";
import { CreateUserDto } from "./user.dto";

export class UserService {
  // --- Creation & Update ---

  public async createUser(data: CreateUserDto) {
    try {
      const password_hash = await generatePasswordHash(data.password);

      const newUser = await prisma.users.create({
        data: {
          username: data.username,
          email: data.email,
          password_hash, // Shorthand property
        },
      });
      return newUser;
    } catch (e: any) {
      if (e.code === "P2002") {
        throw new Error("A user with this email or username already exists.");
      }
      // Re-throw the original error if it's not a unique constraint error
      throw e;
    }
  }

  public async updateUser(
    userId: string,
    data: Partial<{
      username: string;
      email: string;
      password_hash: string;
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
      }
      if (e.code === "P2025") {
        throw new NotFoundError("User to update not found.");
      }
      throw e;
    }
  }

  public async updateUserStatus(status: "online" | "offline", userId: string) {
    await prisma.users.update({
      where: { user_id: userId },
      data: {
        status: status,
        last_seen_at: status === "offline" ? new Date() : undefined,
      },
    });
  }

  // --- Retrieval (Get) Methods ---

  public async getAllUsers() {
    return prisma.users.findMany();
  }

  public async getUserById(userId: string) {
    const user = await prisma.users.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        username: true,
        email: true,
        status: true,
        last_seen_at: true,
        profile_picture_url: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  public async getUserByEmail(email: string) {
    return prisma.users.findUnique({
      where: { email },
    });
  }

  public async getUsersByUsername(username: string) {
    return prisma.users.findMany({
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
        profile_picture_url: true,
      },
    });
  }

  // --- Check Exists Methods ---

  public async checkUserExistsByEmail(email: string): Promise<boolean> {
    const count = await prisma.users.count({
      where: { email },
    });
    return count > 0;
  }

  public async checkUserExistsByUserId(userId: string): Promise<boolean> {
    const count = await prisma.users.count({
      where: { user_id: userId },
    });
    return count > 0;
  }

  // --- Deletion ---

  public async deleteUser(userId: string) {
    try {
      return await prisma.users.delete({
        where: { user_id: userId },
      });
    } catch (e: any) {
      if (e.code === "P2025") {
        throw new NotFoundError("User to delete not found");
      }
      throw e;
    }
  }
}
