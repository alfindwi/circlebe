import Joi from "joi";
import { createUsersDTO } from "../../dto/users-dto";

export const createUserScehma = Joi.object<createUsersDTO>({
    email: Joi.string().email().required(),
    fullName: Joi.string().required().min(5).max(255),
    passwordUsers: Joi.string().min(6),
    username: Joi.string().required().min(5).max(255),
    bio: Joi.string(),
    image: Joi.string().allow(null).optional()
})

export const updateUserScehma = Joi.object<createUsersDTO>({
    fullName: Joi.string().required().min(5).max(255),
    username: Joi.string().required().min(5).max(255),
    bio: Joi.string(),
    image: Joi.string().allow(null).optional()
})

