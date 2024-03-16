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
        preHandler: validateToken,
        schema: {
            description: 'Get all chapter comments',
            tags: ['Comments'],
            security: [
                {
                    JWT: [], // Require Bearer token for authorization
                },
            ],
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

    done()
}