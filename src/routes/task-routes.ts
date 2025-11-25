import { Router } from "express";

import { TaskController } from "@/controllers/task-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const taskRoutes = Router()
const taskController = new TaskController()

taskRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin", "member"]))

taskRoutes.post("/", taskController.create)
taskRoutes.get("/", taskController.index)
taskRoutes.patch("/:id", taskController.update)
taskRoutes.delete("/:id", taskController.delete)
taskRoutes.patch("/:id", taskController.delete)

export {taskRoutes}