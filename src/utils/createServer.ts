import fastify from "fastify"
import { userRoute } from "../modules/routes/user.route"
import fastifySwagger from '@fastify/swagger'
import { version } from '../../package.json'
import fastifySwaggerUi from "@fastify/swagger-ui"
import fastifyCors from "@fastify/cors"
import { favouritesRoute } from "../modules/routes/favourites.route"

export async function createServer() {
    const app = fastify()

    app.register(fastifyCors, {
        origin: 'http://localhost:3000' || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: 'Content-Type'
    })

    const swaggerOptions = {
        swagger: {
            info: {
                title: 'User Auth',
                description: 'User Authentication REST API',
                version
            },
            host: 'localhost:4000',
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                { name: 'User Authentication', description: 'Authentication for user registration'}
            ],
            definitions: {
                User: {
                    type: 'object',
                    required: ['username', 'email', 'pass'],
                    properties: {
                        username: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        pass: {type: 'string' }
                    }
                },
                UserDTO: {
                    type: 'object',
                    required: ['username', 'pass'],
                    properties: {
                        username: { type: 'string' },
                        pass: { type: 'string' }
                    }
                }
            },
            securityDefinitions: {
                JWT: {
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                    description: 'JWT Token'
                },
            },
        },
    }   

    const swaggerUiOptions = {
        routePrefix: "/docs",
        exposeRoute: true,
        staticCSP: true,
    }


    app.register(fastifySwagger, swaggerOptions)
    app.register(fastifySwaggerUi, swaggerUiOptions)
    
    
    app.register(userRoute, { prefix: '/api/auth' })
    app.register(favouritesRoute, { prefix: '/api/favourites' })

    return app
}