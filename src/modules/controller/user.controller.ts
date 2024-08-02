import { logger } from "../../utils/logger"
import { FastifyRequest, FastifyReply } from "fastify"
import userService from "../services/user.service"
import UserModel from "../model/user.model"
import UserDTOModel from "../model/DTO/userDTO.model";
import jwt from 'jsonwebtoken'
import { config } from "../../utils/config";
import { MultipartFile } from '@fastify/multipart'

export default class UserController {

    async addAvatarHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "POST")

        try {
            const file = await req.file()
            console.log(file)
            if (!file) {
                return reply.code(400).send({
                    message: "No file uploaded",
                    success: false
                });
            }

            const imageBuffer = await file.toBuffer()
            const imageBase64 = imageBuffer.toString('base64')

            const fields = await req.fields(); // <--- Use req.fields() to access the fields

            if (!fields || !fields.userId) {
                return reply.code(400).send({
                message: "Invalid userId",
                success: false
                });
            }

            const userId = parseInt(fields.userId, 10);
            

            const data = { 
                imageUrl: imageBase64, 
                userId: userId,
            }
            await userService.addAvatar(data)

            return reply.code(201).send({
                message: "Successfully added avatar",
                success: true
            });
        } catch (e) {
            logger.error(e, `addAvatarHandler error`);
            return reply.code(500).send({
                message: "Error adding avatar",
                e
            });
        }
    }
    

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

    async getUserHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*")
        reply.header("Access-Control-Allow-Methods", "GET")

        try {
            const { user_id } = req.query as { user_id: number }
            const user = await userService.getUserById(user_id)
            return reply.code(200).send({
                user,
                success: true
            })
        } catch (e) {
            logger.error(e, `getUsers err`)
            return reply.code(404).send({
                message: "User Not Found",
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
