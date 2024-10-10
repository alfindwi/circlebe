import { PrismaClient, User, Thread } from "@prisma/client";
import { LoginDTO, RegisterDTO } from "../dto/auth-dto";
import { customError, customErrorCode } from "../types/error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendResetPasswordEmail } from "./node-mailer";

const prisma = new PrismaClient();

class authService {
  async register(data: RegisterDTO): Promise<User | null> {
    const hashedPassword = await bcrypt.hash(data.passwordUsers, 10);

    const user = await prisma.user.create({
      data: {
        ...data,
        passwordUsers: hashedPassword,
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

  async login(
    data: LoginDTO
  ): Promise<{ user: Omit<User, "passwordUsers">; token: string }> {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email },
          { username: data.username },
        ]
      },
    });

    if (!user) {
      throw {
        code: customErrorCode.USERS_NOT_EXIST,
        message: "Email / Password not valid!",
        status: 404,
      } as customError;
    }

    const isValidPassword = await bcrypt.compare(
      data.passwordUsers,
      user.passwordUsers as string
    );

    if (!isValidPassword) {
      throw {
        code: customErrorCode.USERS_NOT_EXIST,
        message: "Email / Password not valid!",
        status: 400,
      } as customError;
    }

    const { passwordUsers, ...userToSign } = user;

    const secretKey = process.env.JWT_SECRET as string;

    const token = jwt.sign(userToSign, secretKey);

    return {
      user: userToSign,
      token: token,
    };
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw {
        status: 404,
        message: "User with this email not found!",
        code: customErrorCode.USERS_NOT_EXIST,
      } as customError;
    }

    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "15m", 
    });

    await sendResetPasswordEmail(user.email, resetToken);

    return "Password reset email has been sent";
  }

  async resetPassword(token: string, newPassword: string): Promise<string> {
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    } catch (error) {
      throw {
        status: 400,
        message: "Invalid or expired token",
      } as customError;
    }

    const { userId } = decodedToken as { userId: string };

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      throw {
        status: 404,
        message: "User not found!",
        code: customErrorCode.USERS_NOT_EXIST,
      } as customError;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: parseInt(userId) }, // Convert string 'userId' to a number
      data: { passwordUsers: hashedPassword },
    });
    

    return "Password has been successfully reset";
  }
}

export default new authService();
