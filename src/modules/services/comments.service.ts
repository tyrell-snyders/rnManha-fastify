import { logger } from "../../utils/logger"
import CommentsModel from "../model/comments.model"
import comments from "../../utils/dummyComments.json"
interface ICommentsService {
    getChapterComments(chapterId: string): Promise<CommentsModel>
}

class Comments {
    constructor(
        public id: number,
        public userId: number, 
        public upvotes: number,
        public downvotes: number,
        public comment: string,
        public chapterId: string,
        public createdAt: string,
        public updatedAt: string
    ) {}
}

class CommentsService implements ICommentsService {
    async getChapterComments(chapterId: string): Promise<CommentsModel> {
        return new Promise(async (resolve, reject) => {
            try {
                //Get all comments
                const cmnts = new Map()

                for (const comment of comments.Comments) {
                    const models = cmnts.get(comment.chapterId) || []
                    const model = new Comments(
                        comment.id,
                        comment.userId,
                        comment.upvotes,
                        comment.downvotes,
                        comment.comment, 
                        comment.chapterId,
                        comment.createdAt,
                        comment.updatedAt
                    )
                    models.push(model)

                    cmnts.set(comment.chapterId, models)
                }

                const models = cmnts.get(chapterId) || []
                if (models.length > 0) 
                    resolve(models)
                else
                    reject(new Error("No comments found"))
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(`Error: ${e.message}`)
                    reject(e)
                }
            }
        })
    }
}

export default new CommentsService