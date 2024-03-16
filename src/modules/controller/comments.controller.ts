import { logger } from "../../utils/logger"
import { FastifyRequest, FastifyReply } from "fastify"
import commentsService from "../services/comments.service";
import { CommentData } from "../../utils/interface";

export default class CommentsController {
    async getChapterCommentsHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");

        try {
            const { chapterId } = req.query as { chapterId: string }
            const comments = await commentsService.getChapterComments(chapterId);

            return reply.code(200).send({
                comments
            })

        } catch (error) {
            logger.error(error, 'getChapterCommentsHandler');
            return reply.code(500).send({
                message: 'Error getting comments',
                error
            })
        }
    }

    async addCommentHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");

        try {
            if (req.body === null) {
                return reply.code(404).send({
                    message: "No data",
                    success: false 
                });
            } else {
                const data = req.body as CommentData
                const result = await commentsService.addChapterComment(data)
                return reply.code(201).send({
                    result
                })
            }
        } catch (e) {
            logger.error(e, 'addCommentHandler')
        }
    }
}