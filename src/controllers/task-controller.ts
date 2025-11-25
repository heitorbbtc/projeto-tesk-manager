import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import z from "zod";
import { AppError } from "@/utils/AppError";

class TaskController {
  async create(request: Request, response: Response){
    const bodySchema = z.object({
      title: z.string({required_error: "It is necessary to provide the team title."}),
      description: z.string({required_error: "It is necessary to provide a description of the time."}),
      assigned_to: z.string(),
      team_id: z.string(),
    })

    const {title, description, assigned_to, team_id} = bodySchema.parse(request.body)

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assignedTo: assigned_to,
        teamId: team_id       
      }

    })

    return response.json(task)

  }

  async index(request: Request, response: Response){
    
    const querySchema = z.object({
      title: z.string().optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    });

    const isAdmin = request.user?.role === "admin";

    const { title, priority } = querySchema.parse(request.query);
    
    const tasks = await prisma.task.findMany({
      where: {
        ...(isAdmin ? {} : { assignedTo: request.user?.id }),

        ...(title && {
          title: {
            contains: title,
            mode: "insensitive",
          },
        }),

        ...(priority && {
          priority,
        }),
      },
    });
    return response.json(tasks)
  }

  async update(request: Request, response: Response){
    const paramsSchema = z.object({
      id: z.string().uuid()
    })
    const bodySchema = z.object({
      title: z.string({required_error: "It is necessary to provide the team title."}),
      description: z.string({required_error: "It is necessary to provide a description of the time."}),
      assignedTo: z.string().optional(),
      teamId: z.string().optional(),
    })

    const {id} = paramsSchema.parse(request.params)
    const {title, description, assignedTo, teamId} = bodySchema.parse(request.body)

    const updateTask = await prisma.task.update({
      data: {
        title,
        description,
        assignedTo,
        teamId,
        updatedAt: new Date()
      },
      where: {
        id
      }
    })

    return response.json(updateTask)
  }

  async delete(request: Request, response: Response){
    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    const {id} = paramsSchema.parse(request.params)

    await prisma.task.delete({
      where: {
        id
      }
    })


    return response.json({message: "deleted"})

  }  


}

export {TaskController}