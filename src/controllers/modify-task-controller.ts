import { Request, Response } from "express";
import { prisma } from "@/database/prisma";
import z from "zod";
import { AppError } from "@/utils/AppError";

class ModifyTaskController {
  async update(request: Request, response: Response) {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    });

    const bodySchema = z.object({
      status: z.enum(["pending", "in_progress", "completed"]).optional(),
      priority: z.enum(["high", "medium", "low"]).optional(),
    });

    const { id } = paramsSchema.parse(request.params);
    const { status, priority } = bodySchema.parse(request.body);

    const isAdmin = request.user?.role === "admin";

    // Buscar tarefa antes da modificação
    const taskBefore = await prisma.task.findUnique({
      where: { id },
    });

    if (!taskBefore) {
      throw new AppError("Task not found", 404);
    }

    // Criar histórico somente se algo mudou
    const somethingChanged =
      (status && status !== taskBefore.status) ||
      (priority && priority !== taskBefore.priority);

    if (somethingChanged) {
      await prisma.tasksHistory.create({
        data: {
          taskId: id,
          changedBy: request.user!.id,
          oldStatus: taskBefore.status,
          newStatus: status ?? taskBefore.status,
        },
      }); 
    }

    // Atualizar task
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        ...(isAdmin ? {} : { assignedTo: request.user?.id }),
        status,
        priority,
        updatedAt: new Date(),
      },
    });

    return response.json(updatedTask);
  }
}

export { ModifyTaskController };
