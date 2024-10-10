import Joi from "joi";
import { LoginDTO, RegisterDTO, ResetPasswordDTO } from "../../dto/auth-dto";

export const registerSchema = Joi.object<RegisterDTO>({
  email: Joi.string().email().required(),
  fullName: Joi.string().required().min(5).max(255),
  passwordUsers: Joi.string().min(6),
});

export const loginSchema = Joi.object<LoginDTO>({
  email: Joi.string().email().optional(),
  username: Joi.string().optional(),
  passwordUsers: Joi.string(),
});

export const forgotPasswordSchema = Joi.object<LoginDTO>({
  email: Joi.string().email().required(),
});

// Reset Password Schema
export const resetPasswordSchema = Joi.object<ResetPasswordDTO>({
  token: Joi.string().required(),
  passwordUsers: Joi.string().min(6).required(),
});
