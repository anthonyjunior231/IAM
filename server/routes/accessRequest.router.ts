import express from 'express';
import {
  createAccessRequestController,
  getAccessRequestByIdController,
  getAccessRequestsController,
  getAccessRequestByUserIdController,
  updateAccessRequestController,
  deleteAccessRequestByIdController,
} from '../controllers/accessRequest.controller';
import { requireSuperAdmin, authMiddleware } from '../middlewares/middleware';

const accessRequestRouter = express.Router();

// Routes for access requests
accessRequestRouter.post('/', authMiddleware, createAccessRequestController);
accessRequestRouter.get('/', authMiddleware, getAccessRequestsController);
accessRequestRouter.get('/:id', authMiddleware, getAccessRequestByIdController);
accessRequestRouter.get('/user/:id', authMiddleware, getAccessRequestByUserIdController);
accessRequestRouter.put('/:id', requireSuperAdmin, updateAccessRequestController);
accessRequestRouter.delete('/:id', requireSuperAdmin, deleteAccessRequestByIdController);

export { accessRequestRouter };
