import { logger } from "../../utils/logger"
import { FastifyRequest, FastifyReply } from "fastify"
import userService from "../services/user.service"
import UserModel from "../model/user.model"
import UserDTOModel from "../model/DTO/userDTO.model";
import jwt from 'jsonwebtoken'
import { config } from "../../utils/config";

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

                if (Object.keys(user).length === 0) {
                    // User not found, return the 404 response
                    return reply.code(404).send({
                        message: "User not found",
                        success: false
                    });
                }

                // User found, return the user with success true
                // token
                const token = jwt.sign({
                    id: user[0].id,
                    usernmae: user[0].username,
                    email: user[0].email,

                }, config.SECRET_KEY_TOKEN, {expiresIn: '15m'})

                return reply.code(201).send({
                    token,
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