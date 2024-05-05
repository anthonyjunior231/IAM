import express from "express";

import {
  login,
  register,
  getUsersController,
  getUserController,
  verifyEmail,
} from "../controllers/auth.controller";

import { requireSuperAdmin } from "../middlewares/middleware";


const authRouter = express.Router();

authRouter.post("/signin", login);
authRouter.post("/verify", verifyEmail);
authRouter.get("/users", getUsersController);
authRouter.get("/user/:userId", getUserController);
authRouter.post("/register", requireSuperAdmin, register);

export { authRouter };
