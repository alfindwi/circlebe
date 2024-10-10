import { RoleEnum } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function authorize(role: RoleEnum) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (user.role !== role) {
      return res.status(401).json({
        message: "FORBIDDEN",
      });
    }
    next();
  };
}
