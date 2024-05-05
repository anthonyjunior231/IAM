import express from "express" 
import {authRouter} from "./auth.router";
import {fileRouter} from "./file.router";
import {folderRouter} from "./folder.router";
import { logRouter } from "./log.router";
import { permissionRouter } from "./permission.router";
import { accessRequestRouter} from "./accessRequest.router"

const apiPath="/api/v1";

const router = express.Router();

router.use(`${apiPath}/file`, fileRouter);
router.use(`${apiPath}/folder`, folderRouter);
router.use(`${apiPath}/auth`, authRouter);
router.use(`${apiPath}/log`, logRouter);
router.use(`${apiPath}/permission`, permissionRouter);
router.use(`${apiPath}/access/request`, accessRequestRouter);
router.use('/uploads', express.static('uploads'));


export { router };