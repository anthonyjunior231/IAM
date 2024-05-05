// services/FolderService.ts
import { Request, Response } from "express";
import { Folder } from "../models/Folder";
import {
  createFolder,
  getFolders,
  getFolderById,
  updateFolder,
  deleteFolderById,
} from "../services/folder.service";
import { getAccessRequestByUserFileId } from "../services/accessRequest.service";
import { createLog } from "../services/log.service";
import { getUserById } from "../services/user.service";

// Controller function to create a new folder
const createFolderController = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    console.log(name, description);

    // Check if name and description are provided
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    // Create a new folder object
    const newFolder: Folder = {
      id: 1,
      name,
      description,
    };

    await createLog({
      id: 1,
      user_id: Number(req.user_id),
      action_taken: `Created folder ${name}`,
      file_id: null,
    });

    // Call the service function to create the folder
    await createFolder(newFolder);

    res.status(201).json({ message: "Folder created successfully" });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get a folder by ID
const getFoldersController = async (req: Request, res: Response) => {
  try {
    // Call the service function to get the folders
    const folders = await getFolders();
    const user_id = Number(req.user_id);

    if (!folders) {
      return res.status(404).json({ message: "Folders not found" });
    }

    // Iterate through each folder
    for (const folder of folders) {
      // Iterate through each file in the folder
      if (folder.files[0] !== null) {
        for (const file of folder.files) {
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

            // Set can_access for the file
            file.can_access = can_access;
          }
        }
      }
    }

    res.status(200).json(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get a folder by ID
const getFolderController = async (req: Request, res: Response) => {
  try {
    const folderId: number = parseInt(req.params.id, 10);

    // Call the service function to get the folder by ID
    const folder = await getFolderById(folderId);
    const user_id = Number(req.user_id);
    const user = await getUserById(user_id);

    for (const file of folder!.files) {
      // Check if access_type is 'org_wide'
      if (file.access_type === "org_wide") {
        // Set can_access to true
        file.can_access = true;
      } else {
        const access_request = await getAccessRequestByUserFileId(
          user_id,
          file.file_id
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

    console.log(folder, "folder")

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.status(200).json(folder);
  } catch (error) {
    console.error("Error fetching folder by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to update a folder
const updateFolderController = async (req: Request, res: Response) => {
  try {
    const folderId: number = parseInt(req.params.id, 10);
    const { name, description } = req.body;

    // Check if id, name, and description are provided
    if (!name || !description) {
      return res
        .status(400)
        .json({ message: "ID, name, and description are required" });
    }

    // Call the service function to get the folder by ID
    const folder = await getFolderById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Create a new folder object with updated values
    const updatedFolder: Folder = {
      id: folderId,
      name,
      description,
    };

    // Call the service function to update the folder
    await updateFolder(folderId, updatedFolder);

    res.status(200).json({ message: "Folder updated successfully" });
  } catch (error) {
    console.error("Error updating folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to delete a folder by ID
const deleteFolderController = async (req: Request, res: Response) => {
  try {
    const folderId: number = parseInt(req.params.id, 10);

    // Call the service function to get the folder by ID
    const folder = await getFolderById(folderId);

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Call the service function to delete the folder by ID
    await deleteFolderById(folderId);

    res.status(200).json({ message: "Folder deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createFolderController,
  getFolderController,
  getFoldersController,
  updateFolderController,
  deleteFolderController,
};
