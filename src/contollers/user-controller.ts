import { Request, Response } from "express";
import userService from "../services/user-service";
import { customError, customErrorCode } from "../types/error";
import {
  createUserScehma,
  updateUserScehma,
} from "../utils/schema/users-schema";
import cloudinaryService from "../services/cloudinary-service";

class UserController {
  async find(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({ data: users });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async findById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await userService.getUserById(Number(id));

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        data: user,
        message: "Success search by ID",
      });
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async findByEmail(req: Request, res: Response) {
    try {
      const email: string = req.params.email;
      const users = await userService.getUserByEmail(email);
      res.json({
        data: users,
        message: "success search by Email",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async findByFullname(req: Request, res: Response) {
    try {
      const fullName: string = req.params.fullName;
      const users = await userService.getUserByfullName(fullName);
      res.json({
        data: users,
        message: "success search by fullName",
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async getSuggestion(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const unfollowedUsers = await userService.getUserSuggestion(Number(userId));
  
      if (!unfollowedUsers || unfollowedUsers.length === 0) {
        return res.status(404).json({ message: 'No users available to follow' });
      }
  
      return res.status(200).json(unfollowedUsers);
    } catch (error) {
      console.error('Error fetching unfollowed users:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
}


  async create(req: Request, res: Response) {
    /*  #swagger.requestBody = {
            required: true,
            content: {
                "multipart/form-data": {
                    schema: {
                        $ref: "#/components/schemas/CreateUserDTO"
                    }  
                }
            }
        } 
    */
    try {
      const { error, value } = await createUserScehma.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errorMessage = error.details.map((detail) => detail.message);
        return res.status(400).json({ message: errorMessage });
      }

      const users = await userService.createUser(value);
      res.json({ users });
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
                      $ref: "#/components/schemas/updateUserDTO"
                  }  
              }
          }
      } 
      */
    try {
      const userId = Number(req.params.id);
  
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }
  
      const { image, backgroundImage } = req.files as {
        image?: Express.Multer.File[];
        backgroundImage?: Express.Multer.File[];
      };
  
      let imageUrl, backgroundImageUrl;
  
      if (image) {
        imageUrl = await cloudinaryService.uploadSingle(image[0]);
      }
  
      if (backgroundImage) {
        backgroundImageUrl = await cloudinaryService.uploadSingle(backgroundImage[0]);
      }
  
      const body = {
        ...req.body,
        ...(imageUrl && { image: imageUrl.secure_url }),
        ...(backgroundImageUrl && { backgroundImage: backgroundImageUrl.secure_url }), 
      };
  
      const value = await updateUserScehma.validateAsync(body);
  
      const updatedUser = await userService.updateUser(userId, value);
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "An error occurred", error });
    }
  }
  

  async searchUser (req: Request, res: Response) {
    try {
      const search = req.query.q as string;
      const users = await userService.searchUser(search);

      res.json({ users });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "An error occurred while searching users",
        error,
      })
    }
  }
}

export default new UserController();
