import { Request, Response } from "express";
import userService from "../services/user-service";
import { customError, customErrorCode } from "../types/error";
import { createUserScehma , updateUserScehma} from "../utils/schema/users-schema";
import cloudinaryService from "../services/cloudinary-service";

class UserController {
    
    async find (req: Request, res: Response) {
        try {
            const users = await userService.getAllUsers();
        res.json({data: users});  
        } catch (error) {
            res.status(500).json(error)
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
    

    async findByEmail (req: Request, res: Response) {
        try {
            const email: string = req.params.email;
        const users = await userService.getUserByEmail(email);
        res.json({
            data: users,
            message: "success search by Email"
        });
        } catch (error) {
           res.status(500).json(error)
        }
    }

    async findByFullname (req: Request, res: Response) {
        try {
            const fullName: string = req.params.fullName;
        const users = await userService.getUserByfullName(fullName);
        res.json({
            data: users,
            message: "success search by fullName"
        });
        } catch (error) {
           res.status(500).json(error)
        }
    }

    async create (req: Request, res: Response) {
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
            const {error, value} = await createUserScehma.validate(req.body, {abortEarly: false});

            if(error) {
                const errorMessage = error.details.map(detail => detail.message);
                return res.status(400).json({message: errorMessage})
            }

            const users = await userService.createUser(value);
            res.json({users});
        } catch (error) {
            res.status(500).json(error)
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
    
            if (!req.file) {
                return res.status(400).json({ message: "Image file is required" });
            }
    
            const image = await cloudinaryService.uploadSingle(req.file as Express.Multer.File);

            const body = {
                ...req.body,
                image: image.secure_url, 
            };
    
            const value = await updateUserScehma.validateAsync(body);
    
            const users = await userService.updateUser(userId, value);
            
            res.json(users);
        } catch (error) {
            res.status(500).json({ message: "An error occurred", error });
        }
    }
    
    
    

    async delete(req: Request, res: Response) {
        try {
            const id = Number(req.params.id)

            const users = await userService.deleteUser(id);
            
            if(!users) {
                throw {
                    status: 404,
                    message: "User not found!",
                    code: customErrorCode.USERS_NOT_EXIST
                } as customError   
            }

            res.json({
                users,
                message: "success delete user"
            })
        } catch (error) {
            res.status(500).json(error)
        }
    }
    
}

export default new UserController()