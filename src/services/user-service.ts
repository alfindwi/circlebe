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
  
          return user;
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

      if (data.fullName) {
        user.fullName = data.fullName;
      }

      if (data.username) {
        user.username = data.username;
      }

      if (data.bio) {
        user.bio = data.bio;
      }
  
      if (data.image) {
        user.image = data.image;
      }
  
      return await prisma.user.update({
          data: user,
          where: { id: userId },
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