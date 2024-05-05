import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { User } from "../../models/User";
import { Permission } from "../../models/Permission";
import { createPermission } from "../../services/permission.service";
import {createUser, getUserByEmail} from "../../services/user.service";
import { defaultConfig } from "../../config/config";
import { Console } from "console";

const saltRounds = 10;
const secretKey = defaultConfig.SECRET_KEY;

export const createAdmin = async (): Promise<void> => {
  try {
    
// Provided object
const userInfo = {
    username: "admin",
    email: "projectiam06@gmail.com",
    password: defaultConfig.ADMIN_PASSWORD,
    role: "super_admin",
    is_active: true,
    is_admin: true
  };
  
  // Destructuring assignment
  const { username, email, password, role, is_active, is_admin } = userInfo;
  
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser: User = {
      id: 1, // Generate unique ID
      username,
      email,
      password: hashedPassword,
      is_admin,
    };
    await createUser(newUser);

    const user = await getUserByEmail(email);
    console.log(userInfo, "info")
    const newPermission: Permission={
      user_id: Number(user?.id),
      can_read: true,
      can_write: true,
      can_delete: true,
      role,
      is_active
     
    }
    await createPermission(newPermission)
    
   console.log({ message: "Admin User Seeded successfully" });
  } catch (error) {
    console.error(error);
    console.log({ message: "Internal Server Error" });
  }
};