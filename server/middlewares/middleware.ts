import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { defaultConfig } from "../config/config";
import { getUserById } from "../services/user.service";

declare module "express" {
  interface Request {
    user_id?: string;
  }
}

// Middleware for extracting user ID from JWT token
export const authMiddleware = (req: Request, res: Response, next: Function) => {
  // Get the JWT token from the request headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify and decode the JWT token
  jwt.verify(token, defaultConfig.SECRET_KEY, (err: any, decoded: any) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }

    // Add the decoded user information to the request object
    req.user_id = decoded.userId; // Assuming userId is stored in the JWT payload
    next();
  });
};

export const requireAdminOrManager = async (
  req: Request,
  res: Response,
  next: Function
) => {
  // Get the JWT token from the request headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify and decode the JWT token
  jwt.verify(
    token,
    defaultConfig.SECRET_KEY,
    async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      const user = await getUserById(decoded.userId);

      console.log(user);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user is a super admin
      if (user.role !== "super_admin" && user.role !== "manager") {
        return res
          .status(403)
          .json({ error: "Unauthorized - Admin or manager required" });
      }

      // Add the decoded user information to the request object
      req.user_id = decoded.userId; // Assuming user id is stored in the database

      next();
    }
  );
};

export const requireSuperAdmin = async (
  req: Request,
  res: Response,
  next: Function
) => {
  // Get the JWT token from the request headers
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  // Verify and decode the JWT token
  jwt.verify(
    token,
    defaultConfig.SECRET_KEY,
    async (err: any, decoded: any) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      const user = await getUserById(decoded.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user is a super admin
      if (!user.is_admin) {
        return res
          .status(403)
          .json({ error: "Unauthorized - Super admin access required" });
      }

      // Add the decoded user information to the request object
      req.user_id = decoded.userId; // Assuming user id is stored in the database

      next();
    }
  );
};
