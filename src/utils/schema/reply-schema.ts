import Joi from "joi";
import { createReplyDTO } from "../../dto/reply-dto";

export const createReplyScehma = Joi.object({
  content: Joi.string().required(), 
  image: Joi.string().allow(null).optional(),  
  threadId: Joi.number().required(),  
});


export const updateReplyScehma = createReplyScehma;
