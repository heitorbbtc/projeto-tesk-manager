import { Router } from "express";
import { TeamsController } from "@/controllers/teams-controller";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";


const teamRoutes = Router()
const teamsController = new TeamsController()

teamRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))
teamRoutes.post("/", teamsController.create)
teamRoutes.get("/", teamsController.index)
teamRoutes.patch("/:id", teamsController.update)
teamRoutes.delete("/:id", teamsController.delete)

export {teamRoutes}