import { Router } from "express";

import { usersRoutes } from "./users-routes";
import { sessionsRoutes } from "./sessions-routes";
import { teamRoutes } from "./team-routes";
import { teamMembersRoutes } from "./team-members-routes";
import { taskRoutes } from "./task-routes";
import { modifyTaskRoutes } from "./modify-task-routes";
import { taskHistoryRoutes } from "./task-history-routes";

const routes = Router()
routes.use("/users", usersRoutes)
routes.use("/sessions", sessionsRoutes)
routes.use("/team", teamRoutes)
routes.use("/team-members", teamMembersRoutes)
routes.use("/task", taskRoutes)
routes.use("/modify-task", modifyTaskRoutes)
routes.use("/task-history-task", taskHistoryRoutes)


export {routes}