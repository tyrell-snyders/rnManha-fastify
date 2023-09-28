import fastify from "fastify";
import { userRoute } from "../modules/routes/user.route";

export async function createServer() {
    const app = fastify()

    app.register(userRoute, {prefix: '/api/auth'})

    return app
}