import express from "express";

import {
  createFolderController,
  getFoldersController,
  updateFolderController,
  getFolderController,
  deleteFolderController,
} from "../controllers/folder.controller";

import { authMiddleware, requireAdminOrManager, requireSuperAdmin } from "../middlewares/middleware";

const folderRouter = express.Router();

// Routes for folders
folderRouter.post("/", requireAdminOrManager, createFolderController);
folderRouter.get("/", authMiddleware, getFoldersController);
folderRouter.get("/:id", authMiddleware, getFolderController);
folderRouter.put("/:id", requireSuperAdmin, updateFolderController);
folderRouter.delete("/:id", requireSuperAdmin, deleteFolderController);

export { folderRouter };
