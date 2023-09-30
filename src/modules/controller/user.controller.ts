import { logger } from "../../utils/logger"
import fastify, { FastifyRequest, FastifyReply } from "fastify"
import userService from "../services/user.service"
import UserModel from "../model/user.model"
import UserDTOModel from "../model/DTO/userDTO.model";

export default class UserController {

    async registerUserHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "POST")
        try {
            await userService.registerUser(req.body as UserModel);
            return reply.code(201).send({
                message: "Successfully registered",
                success: true
            });
        } catch (e) {
            logger.error(e, `registerUserHandler error`);
            return reply.code(500).send({
                message: "Error registering user",
                e
            });
        }
    }
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

    async loginUserHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "POST");
        try {
            if (req.body == null) {
                return reply.code(404).send({
                    message: "User not found",
                    success: false 
                });
            } else {
                const result = req.body as UserDTOModel;
                const user = await userService.loginUser(result);

                if (user.length === 0) {
                    // User not found, return the 404 response
                    return reply.code(404).send({
                        message: "User not found",
                        success: false
                    });
                }

                // User found, return the user with success true
                return reply.code(200).send({
                    user,
                    success: true
                });
            }
        } catch (e) {
            logger.error(e, `loginUserHandler err`)
            return reply.code(400).send({
                message: "Error Logging in",
                e,
                success: false
            })
        }
    }
}