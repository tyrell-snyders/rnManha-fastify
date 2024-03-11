import { logger } from "../../utils/logger"
import { FastifyRequest, FastifyReply } from "fastify"
import CommentsModel from "../model/comments.model"
import commentsService from "../services/comments.service";

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
            logger.error(error);
            return reply.code(500).send({
                message: 'Error getting comments',
                error
            })
        }
    }
}