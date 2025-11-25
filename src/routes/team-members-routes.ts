import { Router } from "express";
import { TeamMembersController } from "@/controllers/team-members-controllers";
import { ensureAuthenticated } from "@/middlewares/ensure-authenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const teamMembersRoutes = Router()
const teamMembersController = new TeamMembersController()

teamMembersRoutes.use(ensureAuthenticated, verifyUserAuthorization(["admin"]))
teamMembersRoutes.post("/", teamMembersController.create)
teamMembersRoutes.get("/", teamMembersController.index)
teamMembersRoutes.delete("/:id", teamMembersController.delete)

export {teamMembersRoutes}