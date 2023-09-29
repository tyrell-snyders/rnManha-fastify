import { logger } from "../../utils/logger"
import fastify, { FastifyRequest, FastifyReply } from "fastify"
import userService from "../services/user.service"
import UserModel from "../model/user.model"
import UserDTOModel from "../model/DTO/userDTO.model";
import { Controller, GET, POST } from "fastify-decorators"

@Controller()
export default class UserController {

    @POST()
    async registerUserHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "POST")
        try {
            const user = await userService.registerUser(req.body as UserModel);
            return reply.code(201).send("Successfully registered");
        } catch (e) {
            logger.error(e, `registerUserHandler error`);
            return reply.code(500).send({
                message: "Error registering user",
                e
            });
        }
    }

    @GET()
    async getUsersHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");
        try {
            logger.info(`Getting Users`)
            const users = await userService.getAllUsers()
            return reply.code(200).send({
                users,
                success: true
            })
        } catch (e) {
            logger.error(e, `getUsers err`)
            return reply.code(400).send({
                message: "Error getting users",
                e
            })
        }
    }

    @POST()
    async loginUserHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "POST");
        try {
            logger.info(`Logging in`)
            const result = await req.body as UserDTOModel
            if (!result)
                return reply.code(404).send({
                    message: "User not found"
                })

            const user = await userService.loginUser(result)
            return reply.code(200).send({
                user,
                success: true
            })
        } catch (e) {
            logger.error(e, `loginUserHandler err`)
            return reply.code(400).send({
                message: "Error Logging in",
                e
            })
        }
    }
}