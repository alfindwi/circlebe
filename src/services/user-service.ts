import { PrismaClient, User } from "@prisma/client";
import { createUsersDTO, editUsersDTO } from "../dto/users-dto";
import { error } from "console";
import { customError, customErrorCode } from "../types/error";

const prisma = new PrismaClient();

class userService {
  async getAllUsers(): Promise<User[]> {
    const users = await prisma.user.findMany({
      include: {
        followeds: true,
        followers: true,
      },
    });

    if (!users) {
      throw {
        status: 404,
        message: "User not found!",
        code: customErrorCode.USERS_NOT_EXIST,
      } as customError;
    }
    return users;
  }

  async getUserById(id: number): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          followeds: true,
          followers: true,
        },
      });
      return user;
    } catch (error) {
      console.error("Error in getUserById service:", error);
      throw new Error("Failed to fetch user by ID");
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      include: {
        followeds: true,
        followers: true,
      },
    });
    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
        code: customErrorCode.USERS_NOT_EXIST,
      } as customError;
    }
    return user;
  }

  async getUserByfullName(fullName: string): Promise<User | null> {
    const user = await prisma.user.findFirst({
      where: {
        fullName: fullName,
      },
      include: {
        followeds: true,
        followers: true,
      },
    });
    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
        code: customErrorCode.USERS_NOT_EXIST,
      } as customError;
    }
    return user;
  }

  async getUserSuggestion(userId: number) {
    const loggedInUser = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        followeds: true,
      },
    });

    if (!loggedInUser) {
      throw new Error("User not found");
    }

    const unfollowedUsers = await prisma.user.findMany({
      where: {
        NOT: {
          id: {
            in: loggedInUser.followeds.map((f) => f.followedId),
          },
        },
        id: { not: userId }, 
      },
      select: {
        id: true,
        fullName: true,
        username: true,
        image: true,
      },
      take: 4, 
    });

    return unfollowedUsers; 
  }


  async createUser(data: createUsersDTO): Promise<User | null> {
    const user = await prisma.user.create({
      data: data,
    });

    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
        code: customErrorCode.USERS_NOT_EXIST,
      } as customError;
    }
    return user;
  }

  async updateUser(userId: number, data: editUsersDTO): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
        code: customErrorCode.USERS_NOT_EXIST,
      } as customError;
    }
  
    const updateData: Partial<User> = {};
  
    if (data.fullName) {
      updateData.fullName = data.fullName;
    }
  
    if (data.username) {
      updateData.username = data.username;
    }
  
    if (data.bio) {
      updateData.bio = data.bio;
    }
  
    if (data.image) {
      updateData.image = data.image;
    }
  
    if (data.backgroundImage) {
      updateData.backgroundImage = data.backgroundImage;
    }
  
    return await prisma.user.update({
      data: updateData,
      where: { id: userId },
    });
  }
  

  async deleteUser(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
        code: customErrorCode.USERS_NOT_EXIST,
      } as customError;
    }

    return await prisma.user.delete({
      where: { id },
    });
  }
}

export default new userService();
