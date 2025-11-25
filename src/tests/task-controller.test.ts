import request from "supertest";
import { prisma } from "@/database/prisma";
import { app } from "@/app";
import { sign } from "jsonwebtoken";
import { authConfig } from "@/config/auth";

describe("TaskController - Create", () => {
  let adminToken: string;
  let user_id: string;
  let team_id: string;
  let task_id: string;

  beforeAll(async () => {
    await prisma.tasksHistory.deleteMany();
    await prisma.task.deleteMany();
    await prisma.teamMembers.deleteMany();
    await prisma.team.deleteMany();
    await prisma.user.deleteMany();

    // cria usuário normal
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "user@test.com",
        password: "123",
      },
    });

    user_id = user.id;

    // cria admin
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@test.com",
        password: "123",
        role: "admin",
      },
    });

    adminToken = sign(
      { sub: admin.id, role: "admin" },
      authConfig.jwt.secret,
      { expiresIn: "1d" }
    );

    // cria time
    const team = await prisma.team.create({
      data: {
        name: "Test Team",
        description: "team for tests",
      },
    });

    team_id = team.id;
  });

  afterAll(async () => {
    if (task_id) {
      await prisma.task.delete({ where: { id: task_id } });
    }

    await prisma.team.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  it("should create a task successfully", async () => {
    const response = await request(app)
      .post("/task") // rota correta
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        title: "Task Example",
        description: "Task description example",
        assigned_to: user_id, // campos corretos do controller
        team_id: team_id,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe("Task Example");

    task_id = response.body.id;
  });
});
