import { Request, Response } from "express";  
import {prisma} from "@/database/prisma"
import z from "zod";
import {hash} from "bcrypt";
import { AppError } from "@/utils/AppError";

class UsersController {
  async create(request: Request, response: Response){
    const bodySchema = z.object({
      name: z.string({required_error: "It is necessary to provide the name."}).trim().min(2),
      email: z.string({required_error: "You need to provide your email address."}).email(),
      password: z.string({required_error: "You need to enter your password."}).min(6),
    })

    const {name, email, password} = bodySchema.parse(request.body)
    
    const userWithSameEmail = await prisma.user.findFirst({where: {email}})

    if(userWithSameEmail) {
      throw new AppError("User with same email already exists")
    }

    const hashedPassword = await hash(password, 8)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    const {password: _, ...userWithoutPassword} = user

    return response.status(201).json(userWithoutPassword)
  }

  async index(request: Request, response: Response) {
    const users = await prisma.user.findMany()

    return response.json(users)
  }
}

export {UsersController}