import { PrismaClient, User, Thread } from "@prisma/client"
import { LoginDTO, RegisterDTO } from "../dto/auth-dto"
import { customError, customErrorCode } from "../types/error"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

class authService{
    async register(data : RegisterDTO) : Promise<User | null>{

      const hashedPassword = await bcrypt.hash(data.passwordUsers, 10)

      const user = await prisma.user.create({data:{
        ...data,
        passwordUsers: hashedPassword,
      }})

      if (!user) {
        throw {
          status: 404,
          message: "User not found!",
          code: customErrorCode.USERS_NOT_EXIST
        } as customError
      }
        return user
    }

    async login(data: LoginDTO): Promise<{ user: Omit<User, "passwordUsers">, token: string }> {
      const user = await prisma.user.findUnique({
          where: {
              email: data.email,
          }
      });
  
      if (!user) {
          throw {
              code: customErrorCode.USERS_NOT_EXIST,
              message: "Email / Password not valid!",
              status: 404
          } as customError;
      }
  
      const isValidPassword = await bcrypt.compare(data.passwordUsers, user.passwordUsers as string);
  
      if (!isValidPassword) {
          throw {
              code: customErrorCode.USERS_NOT_EXIST,
              message: "Email / Password not valid!",
              status: 400
          } as customError;
      }
  
      const { passwordUsers, ...userToSign } = user;
  
      const secretKey = process.env.JWT_SECRET as string;
  
      const token = jwt.sign(userToSign, secretKey);
  
      return {
          user: userToSign,
          token: token
      };
    }
      
}

export default new authService()