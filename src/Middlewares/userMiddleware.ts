import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
export function UserMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.token;
  if (!process.env.JWT_SECRET) {
    throw new Error("jwt_Secret is missing");
  }
  const user = jwt.verify(token as string, process.env.JWT_SECRET);
  if (user) {
    if (typeof user != "string") {
      req.userId = user.userId;
    }
    next()
  } else {
    res.json({
      message: "you are not logged in",
    });
  }
}
