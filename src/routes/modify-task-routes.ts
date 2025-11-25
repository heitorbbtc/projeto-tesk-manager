import { Router } from "express";

import { ModifyTaskController } from "@/controllers/modify-task-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const modifyTaskRoutes = Router()
const modifyTaskController = new ModifyTaskController()

modifyTaskRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin", "member"]))

modifyTaskRoutes.patch("/:id", modifyTaskController.update.bind(modifyTaskController));


export {modifyTaskRoutes}