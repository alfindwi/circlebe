import { PrismaClient, User } from "@prisma/client"
import { createUsersDTO, editUsersDTO } from "../dto/users-dto"
import { error } from "console"
import { customError, customErrorCode } from "../types/error"

const prisma = new PrismaClient()

class userService{
     async getAllUsers() : Promise<User[]> {
      const users = await prisma.user.findMany()

      if(!users) {
        throw {
          status: 404,
          message: "User not found!",
          code: customErrorCode.USERS_NOT_EXIST
        } as customError
      }
        return users
    }
    
    async getUserById(id: number): Promise<User | null> {
      try {
          const user = await prisma.user.findUnique({
              where: { id },
          });
  
          return user; // Akan mengembalikan user atau null jika tidak ditemukan
      } catch (error) {
          console.error("Error in getUserById service:", error);
          throw new Error("Failed to fetch user by ID");
      }
  }
    
     async getUserByEmail(email : string) : Promise<User | null>{
      const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    })
      if (!user) {
        throw {
          status: 404,
          message: "User not found!",
          code: customErrorCode.USERS_NOT_EXIST
        } as customError
      } 
        return user
    }

    async getUserByfullName(fullName : string) : Promise<User | null>{
      const user = await prisma.user.findFirst({
       where: {
           fullName: fullName,
       }
    })
      if (!user) {
        throw {
          status: 404,
          message: "User not found!",
          code: customErrorCode.USERS_NOT_EXIST
        } as customError
      } 
        return user
    }
    
    async createUser(data : createUsersDTO) : Promise<User | null>{
      const user = await prisma.user.create({
        data: data,
      })

      if (!user) {
        throw {
          status: 404,
          message: "User not found!",
          code: customErrorCode.USERS_NOT_EXIST
        } as customError
      }
        return user
    }

    async updateUser(userId:number , data: editUsersDTO): Promise<User | null> {

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
  
      return await prisma.user.update({
          where: { id: userId },
          data: {
              fullName: data.fullName || user.fullName,
              username: data.username || user.username,
              passwordUsers: data.passwordUsers || user.passwordUsers,
              image: data.image || user.image,
              bio: data.bio || user.bio,
          },
      });
  }
  
    async deleteUser(id: number): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: {id},
          });
      
          if (!user) {
            throw {
              status: 404,
              message: "User not found!",
              code: customErrorCode.USERS_NOT_EXIST
            } as customError
          }
      
          return await prisma.user.delete({
            where: { id},
          });
    }
      
}

export default new userService()