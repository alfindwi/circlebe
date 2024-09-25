import Joi from "joi";
import { CreateThreadDTO } from "../../dto/thread-dto";

export const createThreadScehma = Joi.object<CreateThreadDTO>({
    content: Joi.string(),
    image: Joi.string(),
})

export const updateThreadScehma = createThreadScehma