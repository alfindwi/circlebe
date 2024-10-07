import Joi from "joi";
import { CreateThreadDTO } from "../../dto/thread-dto";

export const createThreadScehma = Joi.object<CreateThreadDTO>({
    content: Joi.string(),
    image: Joi.string().optional().allow(null ,""),
})

export const updateThreadScehma = createThreadScehma