import Joi from "joi";
import { createUsersDTO } from "../../dto/users-dto";

export const createUserScehma = Joi.object<createUsersDTO>({
  email: Joi.string().email().required(),
  fullName: Joi.string().required().min(5).max(255),
  passwordUsers: Joi.string().min(6),
  username: Joi.string().required().min(5).max(255),
  bio: Joi.string(),
  image: Joi.string(),
});

export const updateUserScehma = Joi.object<createUsersDTO>({
  fullName: Joi.string().min(5).max(255).optional().allow(null),
  username: Joi.string().min(5).max(255).optional().allow(null, ''), // allow null or empty string
  bio: Joi.string().optional().allow(null, ''), 
  image: Joi.string().optional().allow(null, ''),
  backgroundImage: Joi.string().optional().allow(null, ''),
});


