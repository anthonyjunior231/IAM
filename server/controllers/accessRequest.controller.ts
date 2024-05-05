import { Request, Response } from "express";
import { AccessRequest } from "../models/AccessRequest";
import {
  createAccessRequest,
  getAccessRequestById,
  getAccessRequests,
  updateAccessRequest,
  deleteAccessRequestById,
  getAccessRequestByUserFileId,
  getAccessRequestByUserId,
} from "../services/accessRequest.service";

// Controller function to create an access re8quest
const createAccessRequestController = async (req: Request, res: Response) => {
  try {
    const { file_id, reason } = req.body;
    const user_id = Number(req.user_id);

    // Check if required fields are provided
    if (!file_id || !user_id || !reason) {
      return res
        .status(400)
        .json({ message: "user_id,file_id and reason are required" });
    }

    // Create access request object
    const newAccessRequest: AccessRequest = {
      id: 1, // Assuming the ID is autogenerated in the database
      file_id,
      user_id,
      status: false,
      reason,
    };

    // Call the service function to create access request
    await createAccessRequest(newAccessRequest);

    res.status(201).json({ message: "Access request created successfully" });
  } catch (error) {
    console.error("Error creating access request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get access request by ID
const getAccessRequestByIdController = async (req: Request, res: Response) => {
  try {
    const requestId: number = parseInt(req.params.id, 10);

    // Call the service function to get access request by ID
    const accessRequest = await getAccessRequestById(requestId);

    if (!accessRequest) {
      return res.status(404).json({ message: "Access request not found" });
    }

    res.status(200).json(accessRequest);
  } catch (error) {
    console.error("Error fetching access request by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get access request by ID
const getAccessRequestByUserIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const userId: number = Number(req.user_id);

    // Call the service function to get access request by ID
    const accessRequest = await getAccessRequestByUserId(userId);

    if (!accessRequest) {
      return res.status(404).json({ message: "Access request not found" });
    }

    res.status(200).json(accessRequest);
  } catch (error) {
    console.error("Error fetching access request by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get access request by ID
const getAccessRequestsController = async (req: Request, res: Response) => {
  try {
    // Call the service function to get access request by ID
    const accessRequests = await getAccessRequests();

    if (!accessRequests) {
      return res.status(404).json({ message: "Access request not found" });
    }

    res.status(200).json(accessRequests);
  } catch (error) {
    console.error("Error fetching access request by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to update access request
const updateAccessRequestController = async (req: Request, res: Response) => {
  try {
    const requestId: number = parseInt(req.params.id, 10);
    const { file_id, user_id, status, reason } = req.body;

    console.log(file_id, user_id, status, reason);

    // Check if required fields are provided
    if (!file_id || typeof status !== "boolean" || !reason) {
      return res
        .status(400)
        .json({ message: "File ID, status, and reason are required" });
    }

    // Create access request object
    const updatedAccessRequest: AccessRequest = {
      id: requestId,
      file_id,
      user_id,
      status,
      reason,
    };

    // Call the service function to update access request
    await updateAccessRequest(requestId, updatedAccessRequest);

    res.status(200).json({ message: "Access request updated successfully" });
  } catch (error) {
    console.error("Error updating access request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to delete access request by ID
const deleteAccessRequestByIdController = async (
  req: Request,
  res: Response
) => {
  try {
    const requestId: number = parseInt(req.params.id, 10);

    // Call the service function to delete access request by ID
    await deleteAccessRequestById(requestId);

    res.status(200).json({ message: "Access request deleted successfully" });
  } catch (error) {
    console.error("Error deleting access request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createAccessRequestController,
  getAccessRequestByIdController,
  getAccessRequestByUserIdController,
  getAccessRequestsController,
  updateAccessRequestController,
  deleteAccessRequestByIdController,
};
