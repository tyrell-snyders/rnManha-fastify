import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import CommentsController from '../controller/comments.controller'

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

    done()
}