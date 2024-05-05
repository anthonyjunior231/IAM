// middleware/authMiddleware.ts
import { Request, Response, NextFunction, request } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { Permission } from "../models/Permission";
import {
  createUser,
  getUserByEmail,
  getUserById,
  getUsers,
  sendEmailVerification,
  verifyEmailVerification
} from "../services/user.service";
import {
  createPermission,
  getPermissionByUserId,
} from "../services/permission.service";
import { defaultConfig, verificationConfig } from "../config/config";
import { createLog } from "../services/log.service";
import { v4 } from "uuid";
import nodemailer from 'nodemailer';


const saltRounds = 10;
const secretKey = defaultConfig.SECRET_KEY;

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role) {
      res
        .status(400)
        .json({ message: "username, email, password, role are required" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser: User = {
      id: 1, // Generate unique ID
      username,
      email,
      password: hashedPassword,
      is_admin: false,
    };
    await createUser(newUser);

    const user = await getUserByEmail(email);
    const newPermission: Permission = {
      user_id: Number(user?.id),
      can_read: false,
      can_write: false,
      can_delete: false,
      role,
      is_active: true,
    };
    await createPermission(newPermission);

    await createLog({
      id: 1,
      user_id: Number(req.user_id),
      action_taken: `Created User ${username}`,
      file_id: null,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    // console.log(email, password);
    const user = await getUserByEmail(email);

    const permission = await getPermissionByUserId(Number(user?.id));

    const role = permission?.role;
    const is_active = permission?.is_active;

    const username = user?.username;
    if (!user) {
      res.status(401).json({ message: "Invalid email" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }
    const token = jwt.sign({ userId: user.id }, secretKey);

    const verificationCode = v4().substring(0, 5);
    let code = await sendEmailVerification(verificationCode, email);


    // send a messsage
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: verificationConfig?.username,
        pass: verificationConfig?.password
      }
    });

    // construct the email
    let sender = 'noreply@gmail.com'
    const mailOptions = {
      from: sender,
      to: email,
      subject: "Verify your Staff Account to be secure.",
      html: `Here is your verification code - ${verificationCode}`
    }
    transport.sendMail(mailOptions, async (err, resp) => {
      if (err) {
        console.log(err)
        return res.status(200).json({
          message: 'Error sending message'
        }
        );
      } else {
        await createLog({
          id: 1,
          user_id: Number(user.id),
          action_taken: "Logged In",
          file_id: null,
        });
        return res.json({
          username,
          token,
          email,
          role,
          is_active,
          id: user.id,
        });
      }
    }
    )

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const verifyEmail = async (req: Request , res: Response) => {
  const { code } = req.body;
  const user = await verifyEmailVerification(code);
  if (!user) {
    return res.status(401).json({ message: "Invalid token", data : null});
  } else {
    return res.status(200).json({ message: "Email Verified", data : code });
  }
}

// Controller function to get a folder by ID
export const getUsersController = async (req: Request, res: Response) => {
  try {
    // Call the service function to get the folder by ID
    const folders = await getUsers();

    if (!folders) {
      return res.status(404).json({ message: "Users not found" });
    }

    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// Controller function to get a folder by ID
export const getUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    // Call the service function to get the folder by ID
    const user = await getUserById(Number(userId));

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(user);

    res.status(200).json(user);
  } catch (error) {
    console.error("Featching user", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware for authenticating JWT token
// export function authenticateToken(req: Request, res: Response, next: NextFunction): void {
export function authenticateToken(
  req: any,
  res: Response,
  next: NextFunction
): void {
  // Extract the token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  // Verify and decode the token
  jwt.verify(token, secretKey, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: "Invalid token" });
      return;
    }

    // Add the decoded user information to the request object
    req.user = decoded;
    next();
  });
}
