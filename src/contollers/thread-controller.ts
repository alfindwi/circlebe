import { Request, Response } from "express";
import threadService from "../services/thread-service";
import { customError, customErrorCode } from "../types/error";
import { createThreadScehma } from "../utils/schema/thread-schema"; 
import cloudinaryService from "../services/cloudinary-service";




class ThreadController {
    
    async find(req: Request, res: Response) {
        try {
          const threads = await threadService.getAllThreads();
          res.json(threads);
        } catch (error) {
          res.status(500).json(error);
        }
    }
    

    async findById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const thread = await threadService.getThreadById(Number(id));

            res.json({
                data: thread,
                message: "Success search by Id",
            });
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }


    async addLike(req: Request, res: Response) {
        /*  #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/AddThreadLikeDTO"
                        }  
                    }
                }
            } 
        */

        const {threadId} = req.params;
        await threadService.addLikeToThread(Number(threadId)); 
        res.status(200).json({ message: "Like added successfully" });
    }
    

    async findThreadByUserId(req: Request, res: Response) {
        try {
            const { userId } = req.params;
    
            if (!userId) {
                return res.status(400).json({ message: "User ID is required" });
            }
    
            const thread = await threadService.getThreadsByUserId(Number(userId));
    
            console.log("Thread found:", thread); 
    
            return res.json({
                data: thread,
                message: "Success search by Id"
            });
        } catch (error) {
            console.error("Error in findThreadByUserId:", error); 
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    
    

    async create(req: Request, res: Response) {
        /*  #swagger.requestBody = {
                required: true,
                content: {
                    "multipart/form-data": {
                        schema: {
                            $ref: "#/components/schemas/CreateThreadDTO"
                        }  
                    }
                }
            } 
        */
    
        try {
          const user = (req as any).user;
          const image = await cloudinaryService.uploadSingle((req.file as Express.Multer.File));
          
          const body = {
            ...req.body,
            image: image.secure_url
          }
          const value = await createThreadScehma.validateAsync(body);
          const threads = await threadService.createThread(value, user);
          res.json(threads);
        } catch (error) {
          res.status(500).json(error);
        }
    }

    async update(req: Request, res: Response) {
        /*  #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        $ref: "#/components/schemas/UpdateThreadDTO"
                    }  
                }
            }
        } 
    */
        try {
            const thread = await threadService.updateThread(req.body);
            
            res.json(thread);
          } catch (error) {
            res.status(500).json(error);
          }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            const thread = await threadService.deleteThread(id);
            
            if(!thread) {
                throw {
                    status: 404,
                    message: "Thread not found!",
                    code: customErrorCode.USERS_NOT_EXIST
                } as customError   
            }

            res.json({
                thread,
                message: "success delete thread"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    
}

export default new ThreadController()