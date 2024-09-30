import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { Request, Response } from "express";
import { decode } from "jsonwebtoken";
import authService from "../services/auth-service";
import { GoogleOAuthCallback } from "../types/oauth/google";
import { loginSchema, registerSchema } from "../utils/schema/auth-schema";
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";


const prisma = new PrismaClient();

class AuthController {
    
    async login (req: Request, res: Response) {
        /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/LoginDTO"
                    }  
                }
            }
        } 
    */
        try {
            const {error, value } = await loginSchema.validate(req.body, {abortEarly: false});
            if(error) {
                const errorMessage = error.details.map(detail => detail.message);
                return res.status(400).json({message: errorMessage})
            }

            const users = await authService.login(value);
        res.json(users);  
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async register (req: Request, res: Response) {
        /*  #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/RegisterDTO"
                    }  
                }
            }
        } 
    */
        try {
            const {error, value} = await registerSchema.validate(req.body, {abortEarly: false});
            
            if(error) {
                const errorMessage = error.details.map(detail => detail.message);
                return res.status(400).json({message: errorMessage})
            }
            await authService.register(value);
            const users = await authService.login(value)
        res.json(users);  
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async check (req: Request, res: Response) {
        try {
            const user = (req as any).user;
        res.json(user);  
        } catch (error) {
            res.status(500).json(error)
        }
    }

    async googleOAuth (req: Request, res: Response) {
        const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const GOOGLE_CALLBACK_URL = "http%3A//localhost:4000/api/v1/google/callback";
        const GOOGLE_OAUTH_SCOPES = [
        "https%3A//www.googleapis.com/auth/userinfo.email",
        "https%3A//www.googleapis.com/auth/userinfo.profile",
        ];

        const state = "haifrombackend";
        const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
        const GOOGLE_OAUTH_CONSENT_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
        res.redirect(GOOGLE_OAUTH_CONSENT_URL);
    }

    async googleOAuthCallback (req: Request, res: Response) {
        const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
        const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL!;
        const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

        const code = req.query.code;

        const data = {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: "/google/callback",
            grant_type: "authorization_code",
        }   

        const response = await axios.post(GOOGLE_ACCESS_TOKEN_URL, data)

        const decodedToken = decode(response.data.id_token) as GoogleOAuthCallback;

        if (!decodedToken) {
        return res.status(400).json({ message: "Invalid ID token" });
        }

        const { email, name } = decodedToken;

        const googleUser = await prisma.user.findFirst({
            where: {
              email,
              socialConnection: "GOOGLE",
            },
        });

        const secretKey = process.env.JWT_SECRET as string;

        if (!googleUser) {
            const user = await prisma.user.create(
                {
                    data: {
                        email,
                        fullName: name,
                        username: decodedToken.family_name,
                        socialConnection: "GOOGLE",
                        image: decodedToken.picture
                    }
                }
            );
            const {passwordUsers, ...userToSign} = user;
            const token = jwt.sign(userToSign, secretKey);

            return res.redirect(`http://localhost:4000?accessToken=${token}`);
        }

        const {passwordUsers, ...userToSign} = googleUser;
        const token = jwt.sign(userToSign, secretKey);

        res.send(response.data);
    }
}

export default new AuthController()