import {
 createFileController, getAllFilesController, getFileController, updateFileController, deleteFileController
} from "../controllers/file.controller";
import express from "express";
import multer from "multer";
import path from "path";
import { authMiddleware, requireSuperAdmin } from "../middlewares/middleware";


// Configure Multer middleware (adjust destination folder as needed)
const filePath = path.resolve(__dirname, "../uploads");
const upload = multer({ dest: filePath });

const fileRouter = express.Router();

fileRouter.post(
  "/",
  authMiddleware,
  upload.single("file"),
  createFileController
);
fileRouter.get("/", authMiddleware, getAllFilesController);
fileRouter.get("/:id", authMiddleware, getFileController);
fileRouter.put("/:id", authMiddleware,  upload.single("file"), updateFileController);
fileRouter.delete("/:id", authMiddleware, deleteFileController);


export { fileRouter }