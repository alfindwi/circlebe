import { Request, Response } from "express";
import userService from "../services/user-service";
import { customError, customErrorCode } from "../types/error";
import { createUserScehma , updateUserScehma} from "../utils/schema/users-schema";
import threadService from "../services/thread-service";
import followService from "../services/follow-service";
import { createFollowSchema } from "../utils/schema/create-follow-schema";

class followController {
    async postFollow(req: Request, res: Response) {
        try {
          const { error, value } = await createFollowSchema.validate(req.body, { abortEarly: false });
      
          if (error) {
            const errorMessage = error.details.map(detail => detail.message);
            return res.status(400).json({ message: errorMessage });
          }
      
          const follow = await followService.createFollow(value);
          res.status(201).json(follow); // Send a 201 Created status
        } catch (error) {
          console.error('Error in postFollow:', error); // Log the error
          res.status(500).json({ message: 'An error occurred', error });
        }
      }
      
  
    async findFollow(req: Request, res: Response) {
      try {
        const follows = await followService.getAllFollow();
        res.json(follows);
      } catch (error) {
        console.error('Error in findFollow:', error);
        res.status(500).json({ message: 'An error occurred', error });
      }
    }
  }

export default new followController()