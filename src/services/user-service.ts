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
  
    // Construct updateData object to include provided values or keep existing ones
    const updateData: Partial<User> = {
      fullName: data.fullName ?? user.fullName, // If not provided, keep current value
      username: data.username !== undefined ? data.username : user.username, // Accept null or empty string
      bio: data.bio !== undefined ? data.bio : user.bio, // Accept null or empty string
      image: data.image || user.image, // Keep current value if not updating
      backgroundImage: data.backgroundImage || user.backgroundImage, // Keep current value if not updating
    };
  
    return await prisma.user.update({
      data: updateData,
      where: { id: userId },
    });
  }
  
  

  async searchUser(query: string) {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          {username: {contains: query}},
          {fullName: {contains: query}},
          {bio: {contains: query}},
        ]
      },
      take: 10,
    });
    return users;
  }
}

export default new userService();
