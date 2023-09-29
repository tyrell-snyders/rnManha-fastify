import fastify from "fastify"
import { userRoute } from "../modules/routes/user.route"
import fastifySwagger, { FastifySwaggerOptions } from '@fastify/swagger'
import { version } from '../../package.json'
import fastifySwaggerUi from "@fastify/swagger-ui"
import { config } from "./config"
import fastifyCors from "@fastify/cors"

export async function createServer() {
    const app = fastify()

    const swaggerOptions = {
        swagger: {
            info: {
                title: "RN_Manga",
                description: "User Authentication for RUIN_MANGA Web App/Desktop/Mobile App",
                version,
            },
            host: `localhost:4000`,
            schemes: ["http", "https"],
            consumes: ["application/json"],
            produces: ["application/json"],
            tags: [{ name: "Default", description: "Default" }],
        },
    }   

    const swaggerUiOptions = {
        routePrefix: "/docs",
        exposeRoute: true,
    };

    app.register(fastifySwagger, swaggerOptions)
    app.register(fastifySwaggerUi, swaggerUiOptions)
    app.register(fastifyCors, {
        origin: '*',
        methods: ['GET', 'POST']
    })
    app.register(userRoute, { prefix: '/api/auth' })

    return app
}