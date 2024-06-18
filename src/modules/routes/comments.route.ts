import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import CommentsController from '../controller/comments.controller'
import validateToken from '../../utils/validateToken'

export function commentsRoute(
    app: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void
) {
    const controller = new CommentsController()
    app.get('/get-chapter-comments', {
        schema: {
            description: 'Get all chapter comments',
            tags: ['Comments'],
            querystring: {
                type: 'object',
                properties: {
                    chapterId: { type: 'string' }
                },
                required: ['chapterId']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        comments: {
                            type: 'array',
                            properties: {
                                id: { type: 'number' },
                                comment: { type:'string' },
                                user_id: { type: 'number' },
                                chapter_id: { type:'string' },
                                createdAt: { type:'string' },
                                updatedAt: { type:'string' },
                                upVotes: { type: 'number' },
                                downVotes: { type: 'number' },
                                edited: { type: 'boolean' },
                                ruin_users: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'number' },
                                        username: { type:'string' },
                                        email: { type:'string' }
                                    }
                                }
                            }
                        }
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
    }, controller.getChapterCommentsHandler)

    app.post('/add-comment', {
        preHandler: validateToken,
        schema: {
            description: 'Add Comment',
            tags: ['Comments'],
            security: [
                {
                    JWT: [], //Require Bearer token for authorization
                }
            ],
            body: {
                type: 'object',
                    properties: {
                        user_id: {type: 'number'},
                        comment: {type: 'string'},
                        chapter_id: {type: 'string'},
                        upVotes: {type: 'number'},
                        downVotes: {type: 'number'},
                        edited: {type: 'boolean'}
                    },
                    required: ['user_id', 'comment', 'chapter_id']
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        result: { type: 'string' }
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
    }, controller.addCommentHandler)

    app.put('/edit-comment', {
        preHandler: validateToken,
        schema: {
            description: 'Edit Comment',
            tags: ['Comments'],
            security: [
                {
                    JWT: [], //Require Bearer token for authorization
                }
            ],
            body: {
                type: 'object',
                    properties: {
                        user_id: {type: 'number'},
                        comment: {type: 'string'},
                        chapter_id: {type: 'string'},
                        upVotes: {type: 'number'},
                        downVotes: {type: 'number'}
                    },
                    required: ['user_id', 'comment', 'chapter_id']
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        result: {
                            type: 'array'
                        }
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
    }, controller.editCommentHandler)

    app.delete('/delete-comment', {
        preHandler: validateToken,
        schema: {
            description: 'Delete Comment',
            tags: ['Comments'],
            security: [
                {
                    JWT: [], //Require Bearer token for authorization
                }
            ],
            querystring: {
                type: 'object',
                properties: {
                    commentId: { type: 'number' }
                },
                required: ['commentId']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        result: { type:'string' }
                    }
                },
                204: {
                    type: 'object',
                    properties: {
                        result: { type:'string' }
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
    }, controller.deleteCommentHandler)

    done()
}