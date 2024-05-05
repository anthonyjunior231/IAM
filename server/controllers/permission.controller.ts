import { Request, Response } from "express";
import { Permission } from "../models/Permission";

import {
  createPermission,
  getPermissionByUserId,
  updatePermission,
  deletePermissionById,
} from "../services/permission.service";

// Controller function to create file access
const createPermissionController = async (req: Request, res: Response) => {
  try {
    const { user_id, can_read, can_write, can_delete, role } = req.body;

    // Check if required fields are provided
    if (
      !user_id ||
      typeof can_read !== "boolean" ||
      typeof can_write !== "boolean" ||
      typeof can_delete !== "boolean" ||
      !role
    ) {
      return res.status(400).json({
        message: "user ID, can_read, can_write, and can_delete are required",
      });
    }

    // Create file access object
    const newPermission: Permission = {
      user_id,
      can_read,
      can_write,
      can_delete,
      is_active: true,
      role,
    };

    // Call the service function to create file access
    await createPermission(newPermission);

    res.status(201).json({ message: "File access created successfully" });
  } catch (error) {
    console.error("Error creating file access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get file access by ID
const getPermissionController = async (req: Request, res: Response) => {
  try {
    const user_id: number = parseInt(req.params.id, 10);

    // Call the service function to get file access by ID
    const permission = await getPermissionByUserId(user_id);

    if (!permission) {
      return res.status(404).json({ message: "Permission not found" });
    }

    res.status(200).json(permission);
  } catch (error) {
    console.error("Error fetching file access by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to update file access
const updatePermissionController = async (req: Request, res: Response) => {
  try {
    const user_id: number = parseInt(req.params.id, 10);
    const { can_read, can_write, can_delete, is_active, role } = req.body;

    console.log(typeof is_active);
    // Check if required fields are provided
    if (
      !user_id ||
      typeof can_read !== "boolean" ||
      typeof can_write !== "boolean" ||
      typeof can_delete !== "boolean"
    ) {
      return res.status(400).json({
        message: "user ID, can_read, can_write, and can_delete are required",
      });
    }

    // Create file access object
    const updatedPermission = {
      user_id,
      can_read,
      can_write,
      can_delete,
      is_active,
      role,
    };

    // Call the service function to update file access
    await updatePermission(user_id, updatedPermission);

    res.status(200).json({ message: "File access updated successfully" });
  } catch (error) {
    console.error("Error updating file access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to delete file access by ID
const deletePermissionController = async (req: Request, res: Response) => {
  try {
    const user_id: number = parseInt(req.params.id, 10);

    // Call the service function to delete file access by ID
    await deletePermissionById(user_id);

    res.status(200).json({ message: "File access deleted successfully" });
  } catch (error) {
    console.error("Error deleting file access:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createPermissionController,
  getPermissionController,
  deletePermissionController,
  updatePermissionController,
};
