import { Request, Response } from "express"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"
import z from "zod"

class TeamsController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string({required_error: "It is necessary to provide the team name."}),
      description: z.string().nullish()
    })

    const {name, description} = bodySchema.parse(request.body)

    const existingTeam = await prisma.team.findFirst({
      where: { name }
    })

    if (existingTeam) {
      throw new AppError("Team with same name already exists", 400)
    }

    const team = await prisma.team.create({
      data: {
        name,
        description
      }
    })

    return response.json(team)
  }

  async index(request: Request, response: Response) {
    const teams = await prisma.team.findMany({})

    return response.json(teams)
  }

  async update(request: Request, response: Response) {

    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    const bodySchema = z.object({
      name: z.string({required_error: "It is necessary to provide the team name."}).optional(),
      description: z.string().nullish()
    })

    
    const {name, description} = bodySchema.parse(request.body)
    const {id} = paramsSchema.parse(request.params)
    
    if(!name && !description){
      throw new AppError("It is necessary to provide the name or description.")
    }

    await prisma.team.update({
      data: {
        name,
        description,
      },      
      where: {
        id,
      }
    })

    return response.json("updated")

  }

  async delete(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const {id} = paramsSchema.parse(request.params)

    await prisma.team.delete({     
      where: {id}
    })

    return response.json({message: "deleted"})
  }
}

export { TeamsController }