import Joi from "joi";
import { CreateThreadDTO } from "../../dto/thread-dto";

export const createThreadSchema = Joi.object({
  content: Joi.string().required(),
  image: Joi.string().uri().allow(null).optional(),
});

  

