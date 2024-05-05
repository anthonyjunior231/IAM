// services/CategoryService.ts
import { Request, Response } from 'express';
import { Log } from '../models/Log';
import {
    getAllLogs, getLogsByFileId, getLogsByUserId
} from '../services/log.service';


// Controller function to get a category by ID
const getLogsController = async (req: Request, res: Response) => {
    try {
      // Call the service function to get the category by ID
      const logs = await getAllLogs();
  
      if (!logs) {
        return res.status(404).json({ message: 'Categories not found' });
      }
  
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Controller function to get a log by user ID
const getUserLogController = async (req: Request, res: Response) => {
  try {
    const logId: number = parseInt(req.params.id, 10);

    // Call the service function to get the log by user ID
    const logs = await getLogsByUserId(logId);

    if (!logs) {
      return res.status(404).json({ message: 'Logs not found' });
    }

    res.status(200).json(logs);
  } catch (error) {
    console.error('Error fetching logs', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get a log by fileID
const getFileLogController = async (req: Request, res: Response) => {
    try {
      const logId: number = parseInt(req.params.id, 10);
  
      // Call the service function to get the log by File ID
      const logs = await getLogsByFileId(logId);
  
      if (!logs) {
        return res.status(404).json({ message: 'Logs not found' });
      }
  
      res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching logs', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  


export {getLogsController, getFileLogController, getUserLogController};
