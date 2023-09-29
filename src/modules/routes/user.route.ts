import fastify, { FastifyInstance, FastifyPluginOptions } from 'fastify'
import userController from '../controller/user.controller'
import UserModel from '../model/user.model'

export function userRoute(
    app: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void
) {
    const controller = new userController()

    app.get('/users', {
        schema: {
            description: 'Gets all users',
            tags: ['User Authentication'],
            response: {
                200: {
                    type: 'object',
                    properties: {
                        users: {
                            type: 'array',
                            items: {
                            type: 'object',
                            properties: {
                                username: { type: 'string' },
                                email: { type: 'string' },
                                password: { type: 'string' },
                            },
                            },
                        },
                        success: { type: 'boolean' },
                    },
                },
                400: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, controller.getUsersHandler)

    app.post('/register', {
        schema: {
            description: 'User Registration',
            tags: ['User Authentication'],
            params: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    pass: { type: 'string'}
                }
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        user: { type: 'object', properties: {
                            username: { type: 'string' },
                            email: { type: 'string' },
                            password: { type: 'string' }
                        
                        }},
                        success: { type: 'boolean' }
                    }
                },
                500: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, controller.registerUserHandler)

    app.post('/login', {
        schema: {
            description: 'User Login',
            tags: ['User Authentication'],
            params: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    pass: { type: 'string'}
                }
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        users: {
                            type: 'array',
                            items: {
                            type: 'object',
                            properties: {
                                username: { type: 'string' },
                                email: { type: 'string' },
                                password: { type: 'string' },
                            },
                            },
                        },
                        success: { type: 'boolean' },
                    },
                },
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                },
                400: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                    }
                }
            }
        }
    }, controller.loginUserHandler)

    done()
}