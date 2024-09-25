import Joi from "joi";
import { LoginDTO, RegisterDTO } from "../../dto/auth-dto";

export const registerSchema = Joi.object<RegisterDTO>({
    email: Joi.string().email().required(),
    fullName: Joi.string().required().min(5).max(255),
    passwordUsers: Joi.string().min(6)
})

export const loginSchema = Joi.object<LoginDTO>({
    email: Joi.string().email(),
    passwordUsers: Joi.string(),
  });
  

