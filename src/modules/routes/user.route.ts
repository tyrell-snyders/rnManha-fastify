import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import userController from '../controller/user.controller'
import validateToken from '../../utils/validateToken'

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
                200:{
                    type: 'object',
                    properties: {
                        users: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    id: { type: 'number' },
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

    app.get('/user', {
        schema: {
            description: 'Get a single user',
            tags: ['User Authentication'],
            querystring: {
                type: 'object',
                properties: {
                    user_id: { type: 'number' }
                },
                required: ['user_id']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'number' },
                                username: { type: 'string' },
                                email: { type: 'string' }
                            },
                        },
                        success: { type: 'boolean' },
                    }
                },
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, controller.getUserHandler)

    app.post('/register', {
        schema: {
            description: 'User Registration',
            tags: ['User Authentication'],
            body: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    pass: { type: 'string' }
                },
                required: ['username', 'email', 'pass'] // Add required properties
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        success: { type: 'boolean' }
                    }
                },
                500: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            },
        }
    }, controller.registerUserHandler)

    app.post('/add-avatar', {
        schema: {
            description: 'User Avater',
            tags: ['User Authentication'],
            consumes: ['multipart/form-data', 'application/json'],
            response: {
                201: {
                    type: 'object',
                    properties: {
                        message: {type: 'string'}
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
    }, controller.addAvatarHandler)

    app.post('/login', {
        schema: {
            description: 'User Login',
            tags: ['User Authentication'],
            body: {
                type: 'object',
                properties: {
                    username: { type: 'string' },
                    pass: { type: 'string'}
                },
                required: ['username', 'pass']
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        token: { type: 'string' },
                        success: { type: 'boolean' },
                    },
                },
                404: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        success: { type: 'boolean'}
                    }
                },
                400: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' },
                        error: { type: 'string' },
                        success: { type: 'boolean' }
                    }
                }
            }
        }
    }, controller.loginUserHandler)

    done()
}