import { Request, Response } from "express";
import threadService from "../services/thread-service";
import { customError, customErrorCode } from "../types/error";
import { createThreadSchema } from "../utils/schema/thread-schema";
import cloudinaryService from "../services/cloudinary-service";
import { Err } from "joi";

class ThreadController {
  async find(req: Request, res: Response) {
    try {
      const threads = await threadService.getAllThreads();
      res.json(threads);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const thread = await threadService.getThreadById(Number(id));

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      res.json({
        data: thread,
        message: "Success search by Id",
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async LikeFromThread(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/AddThreadLikeDTO"
                    }  
                }
            }
        } 
    */
    try {
      const { threadId } = req.params;
      const user = (req as any).user;

      const isLiked = await threadService.checkIfUserLikedThread(
        Number(threadId),
        user.id
      );

      if (isLiked) {
        await threadService.removeLikeFromThread(Number(threadId), user.id);
        return res
          .status(200)
          .json({ message: "Like removed", isLiked: false });
      } else {
        await threadService.addLikeToThread(Number(threadId), user.id);
        return res.status(200).json({ message: "Like added", isLiked: true });
      }
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }

  async removeLikeFromThread(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/RemoveThreadLikeDTO"
                    }  
                }
            }
        } 
    */
    try {
      const { threadId } = req.params;
      const user = (req as any).user;

      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      try {
        const message = await threadService.removeLikeFromThread(
          Number(threadId),
          user.id
        );
        return res.status(200).json({ message });
      } catch (error) {
        if ((error as Error).message === "Like does not exist") {
          return res.status(404).json({ message: (error as Error).message });
        }
        throw error;
      }
    } catch (error) {
      return res.status(500).json({ message: (error as Error).message });
    }
  }

  async findThreadByUserId(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const thread = await threadService.getThreadsByUserId(Number(userId));

      if (!thread || thread.length === 0) {
        return res
          .status(404)
          .json({ message: "No threads found for this user" });
      }

      return res.json({
        data: thread,
        message: "Success search by userId",
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
              if (!user) {
                return res.status(401).json({ message: "User not authenticated" });
              }
          
              let imageUrl = null;
          
              // Proses file jika diunggah
              if (req.file) {
                const uploadResult = await cloudinaryService.uploadSingle(req.file as Express.Multer.File);
                imageUrl = uploadResult.secure_url;  // Ambil hanya URL gambar dari hasil upload Cloudinary
              }
          
              // Gabungkan data body dengan URL gambar (jika ada)
              const body = {
                ...req.body,
                image: imageUrl || null,  // Sertakan URL gambar jika ada
              };
          
              // Validasi menggunakan Joi
              const value = await createThreadSchema.validateAsync(body);
          
              // Buat thread di database
              const thread = await threadService.createThread(value, user);
              res.json(thread);
            } catch (error) {
              console.error("Error creating thread:", error);
              res.status(500).json({ message: (error as Error).message });
            }
  }

  async update(req: Request, res: Response) {
    try {
      const thread = await threadService.updateThread(req.body);

      if (!thread) {
        return res.status(404).json({ message: "Thread not found" });
      }

      res.json(thread);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const thread = await threadService.deleteThread(id);

      if (!thread) {
        return res.status(404).json({
          message: "Thread not found!",
          code: customErrorCode.USERS_NOT_EXIST,
        });
      }

      res.json({
        thread,
        message: "Success delete thread",
      });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }
}

export default new ThreadController();
