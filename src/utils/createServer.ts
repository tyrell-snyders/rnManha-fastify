import fastify from "fastify"
import { userRoute } from "../modules/routes/user.route"
import fastifySwagger from '@fastify/swagger'
import { version } from '../../package.json'
import fastifySwaggerUi from "@fastify/swagger-ui"
import fastifyCors from "@fastify/cors"
import { favouritesRoute } from "../modules/routes/favourites.route"
import { commentsRoute } from "../modules/routes/comments.route"
import fastifyMultipart from "@fastify/multipart"

export async function createServer() {
    const app = fastify()

    app.register(fastifyCors, {
        origin: 'http://localhost:3000' || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: 'Content-Type'
    })

    app.register(fastifyMultipart, {
    addToBody: true,
    });

    const swaggerOptions = {
        swagger: {
            info: {
                title: 'User Auth',
                description: 'User Authentication REST API',
                version
            },
            host: 'localhost:4000',
            schemes: ['http', 'https'],
            consumes: ['multipart/form-data', 'application/json'],
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
                },
                    AvatarDTO: {
                        type: 'object',
                        required: ['userId', 'imageUrl'],
                        properties: {
                            userId: { type: 'number' },
                            imageUrl: { type: 'string', format: 'binary' },
                        },
                    },
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
    app.register(commentsRoute, { prefix: '/api/comments' })

    return app
}