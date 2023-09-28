import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import userController from '../controller/user.controller'


export function userRoute(
    app: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void
) {
    const controller = new userController()
    app.get('/users', {}, controller.getUsersHandler)

    done()
}