import request from "supertest"
import { prisma } from "@/database/prisma"
import { app } from "@/app"
import { sign } from "jsonwebtoken"

describe("TeamController", () => {
  let team_id: string
  let adminToken: string

  beforeAll(async () => {
    await prisma.tasksHistory.deleteMany()
    await prisma.task.deleteMany()
    await prisma.teamMembers.deleteMany()
    await prisma.team.deleteMany()
    await prisma.user.deleteMany()

    // Cria admin
    const admin = await prisma.user.create({
      data: {
        name: "admin",
        email: "admin@test.com",
        password: "123",
        role: "admin",
      },
    })

    // Gera token do admin
    adminToken = sign({ sub: admin.id }, process.env.JWT_SECRET!, {
      expiresIn: "1d",
    })
  })

  afterAll(async () => {
    if (team_id) {
      await prisma.team.delete({ where: { id: team_id } })
    }
    await prisma.$disconnect()
  })

  it("should create a team successfully", async () => {
    const response = await request(app)
      .post("/team")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Team",
        description: "Example description",
      })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Test Team")

    team_id = response.body.id
  })

  it("should not allow duplicate team name", async () => {
    const duplicateResponse = await request(app)
      .post("/team")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        name: "Test Team", // duplicado
      })

    expect(duplicateResponse.status).toBe(400)
    expect(duplicateResponse.body.message).toBe(
      "Team with same name already exists"
    )
  })
})
