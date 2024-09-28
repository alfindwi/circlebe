import Joi from "joi";
import { createReplyDTO } from "../../dto/reply-dto";

export const createReplyScehma = Joi.object<createReplyDTO>({
    content: Joi.string().required(),
    image: Joi.string().optional(),
    threadId: Joi.string().required() 
});


export const updateReplyScehma = createReplyScehma