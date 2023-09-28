import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import userController from '../controller/user.controller'
import UserModel from '../model/user.model'

export function userRoute(
    app: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void
) {
    const controller = new userController()

    app.get('/users', {}, controller.getUsersHandler)
    app.post('/register', {}, controller.registerUserHandler)
    app.post('/login', {}, controller.loginUserHandler)

    done()
}