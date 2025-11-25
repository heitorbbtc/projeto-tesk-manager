import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import z from "zod";

class TeamMembersController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      user_id: z.string({required_error: "The user_id must be provided."}),
      team_id: z.string({required_error: "The team_id must be provided."})
    })

    const {team_id, user_id} = bodySchema.parse(request.body)

    const userId = await prisma.user.findUnique({
      where: {
        id: user_id
      }
    })
    
    const teamId = await prisma.team.findUnique({
      where: {
        id: team_id
      }
    })

    const teamMembers = await prisma.teamMembers.create({
      data: {
        teamId: team_id,
        userId: user_id
      }
    })

    if(teamMembers){
      throw new AppError("This user is already a member of the selected team.")
    }

    return response.json(teamMembers)
  }

  async index(request: Request, response: Response) {

    const teamMembers = await prisma.teamMembers.findMany({
      include: {
        user: { select: {name: true}},
        team: { select: {name: true}}
      }
    })

    return response.json(teamMembers)

  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const {id} = paramsSchema.parse(request.params)

    const member = await prisma.teamMembers.findUnique({
      where: {
        id
      }
    })

    if(!member) {
      throw new AppError("Team member not found", 404)
    }

    await prisma.teamMembers.delete({     
      where: {id}
    })

    return response.json({message: "deleted"})
  }

}

export {TeamMembersController}