import { Request, Response } from "express";
import { uploadToFirebase, fetchFileFromFirebase } from "./cloud/cloud";
import fs from "fs";
import axios from "axios";
import path from "path";

import { File } from "../models/File";
import {
  createFile,
  getAllFiles,
  getFileById,
  updateFile,
  deleteFileById,
} from "../services/file.service";
import { createLog } from "../services/log.service";
import { defaultConfig } from "../config/config";
import { getAccessRequestByUserFileId } from "../services/accessRequest.service";
import { getUserById } from "../services/user.service";

// Controller function to create a new file
const createFileController = async (req: Request, res: Response) => {
  console.log("it is working");
  try {
    const { file_name, file_size, folder_id, permission_type, description } =
      req.body;
    const file = req.file;
    const user_id = req.user_id;

    if (!file || !file_name || !file_size) {
      return res
        .status(400)
        .json({ message: "File, file_name, file_size are required" });
    }
    if (!permission_type) {
      return res.status(400).json({ message: "permission_type is required" });
    }

    if (permission_type !== "org_wide" && permission_type !== "request_only") {
      return res
        .status(400)
        .json({ message: "permission_type must be org_wide or request_only" });
    }

    let cloudUrl = "";

    const firebaseUrl = await uploadToFirebase(file.path, file_name);
    cloudUrl = firebaseUrl;

    const newFile: File = {
      id: 1,
      user_id: Number(user_id),
      folder_id: folder_id,
      file_name: file_name,
      file_size: file_size,
      access_type: permission_type,
      description: description,
      cloud_url: cloudUrl,
    };

    await createFile(newFile);

    await createLog({
      id: 1,
      user_id: Number(user_id),
      action_taken: `Created File ${file_name}`,
      file_id: null,
    });

    // Clean up the local file
    fs.unlinkSync(file.path);

    res
      .status(200)
      .json({ message: "File created Successfully", file_name, cloudUrl });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(400).json({ message: "Error uploading file" });
  }
};

// Controller function to get all files
const getAllFilesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user_id = Number(req.user_id);
    const files = await getAllFiles();

    const user = await getUserById(user_id);

    for (const file of files as any) {
      // Check if access_type is 'org_wide'
      if (file.access_type === "org_wide") {
        // Set can_access to true
        file.can_access = true;
      } else {
        const access_request = await getAccessRequestByUserFileId(
          user_id,
          file.id
        );

        let can_access = false;

        // Check if access request exists and if it's approved
        if (access_request && access_request.status === true) {
          can_access = true;
        }

        if (user?.is_admin) {
          can_access = true;
        }

        // Set can_access for the file
        file.can_access = can_access;
      }
    }
    res.status(200).json(files);
  } catch (error) {
    console.error("Error fetching all files:", error);
    res.status(500).send("Internal server error");
  }
};

// Controller function to get a file by ID
const getFileController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user_id;

    // Check if fileId is provided
    if (!id) {
      return res.status(400).json({ message: "File ID is required" });
    }
    const file = await getFileById(Number(id));

    // Check if file exists
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Fetch the file from Firebase Storage
    const filePath = await fetchFileFromFirebase(file.file_name);
    const serverFilePath = `http://localhost:8000/uploads/${path.basename(
      filePath
    )}`;
    await createLog({
      id: 1,
      user_id: Number(user_id),
      action_taken: `Downloaded File ${file.file_name}`,
      file_id: null,
    });

    res.json({ file, filePath: serverFilePath });

  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to update a file
const updateFileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.file) {
      const firebaseUrl = await uploadToFirebase(
        req.file.path,
        req.body.file_name
      );
      req.body.cloud_url = firebaseUrl;
    }
    const fileId: number = parseInt(req.params.id, 10);
    const updatedFile: File = req.body;
    await updateFile(fileId, updatedFile);
    res.status(200).json({ message: "File updated successfully" });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to delete a file by ID
const deleteFileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const fileId: number = parseInt(req.params.id, 10);
    const file = await getFileById(Number(fileId));
     await deleteFileById(fileId);
      await createLog({
        id: 1,
        user_id: Number(req.user_id),
        action_taken: `Deleted File ${file?.file_name}`,
        file_id: null,
      });
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createFileController,
  getAllFilesController,
  getFileController,
  updateFileController,
  deleteFileController,
};
