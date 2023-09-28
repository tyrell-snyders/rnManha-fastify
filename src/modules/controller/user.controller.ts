import { logger } from "../../utils/logger"
import fastify, { FastifyRequest, FastifyReply } from "fastify"
import userService from "../services/user.service"
import UserModel from "../model/user.model"

export default class UserController {
    async registerUserHandler(req: FastifyRequest, reply: FastifyReply) {

    }

    async getUsersHandler(req: FastifyRequest, reply: FastifyReply) {
        try {
            const users = await userService.getAllUsers()
            return users
        } catch (e) {
            logger.error(e, `getUsers err`)
            return reply.code(400).send({
                message: "Error getting users",
                e
            })
        }
    }
}