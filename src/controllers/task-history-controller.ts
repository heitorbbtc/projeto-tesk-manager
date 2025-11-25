import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import z from "zod";

class TaskHistoryController {
  async index(request: Request, response: Response) {
    const querySchema = z.object({
      task_id: z.string().uuid().optional(),
    });

    const { task_id } = querySchema.parse(request.query);

    const isAdmin = request.user?.role === "admin";

    const history = await prisma.tasksHistory.findMany({
      where: {
        ...(task_id ? { taskId: task_id } : {}),
        ...(!isAdmin ? { changedBy: request.user?.id } : {}),
      },
      orderBy: { changedAt: "desc" },
      include: {
        changedFrom: { select: { id: true, name: true } },
        referenceTask: { select: { id: true, title: true } },
      },
    });

    return response.json(history);
  }
}

export { TaskHistoryController };
