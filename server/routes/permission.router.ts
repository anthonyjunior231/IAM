import {
  createPermissionController,
  getPermissionController,
  updatePermissionController,
  deletePermissionController,
} from "../controllers/permission.controller";

import express from "express";

import { requireSuperAdmin } from "../middlewares/middleware";

const permissionRouter = express.Router();

permissionRouter.post("/", requireSuperAdmin, createPermissionController);
permissionRouter.put("/:id", requireSuperAdmin, updatePermissionController);
permissionRouter.delete("/:id", requireSuperAdmin, deletePermissionController);
permissionRouter.get("/:id", requireSuperAdmin, getPermissionController);

export { permissionRouter };
