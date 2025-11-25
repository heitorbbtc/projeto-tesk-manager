import request from "supertest"
import { prisma } from "@/database/prisma"

import { app } from "@/app"

describe("UsersController", () => {
  let user_id: string

  afterAll(async () => {
  if (user_id) {
    await prisma.user.delete({ where: { id: user_id } })
  }
})

  it("You must create a user with an existing email address.", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Test User")

    user_id = response.body.id
  })

  it("Attempting to register users with an already existing email address.", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("User with same email already exists")
  })
})