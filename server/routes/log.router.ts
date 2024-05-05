import express from "express"

import{
  getLogsController, getFileLogController, getUserLogController
} from "../controllers/log.controller";

import {requireSuperAdmin} from "../middlewares/middleware"


const logRouter=express.Router();

logRouter.get('/', getLogsController);
logRouter.get('/user/:id', getUserLogController);
logRouter.get('/file/:id', getFileLogController);





export {logRouter}