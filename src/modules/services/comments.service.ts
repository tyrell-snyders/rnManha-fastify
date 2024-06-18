import { logger } from "../../utils/logger"
import CommentsModel from "../model/comments.model"
import { CommentData } from "../../utils/interface"
import prisma from '../../utils/lib/prismaDB'

interface ICommentsService {
    getChapterComments(chapterId: string): Promise<CommentsModel[]>
    addChapterComment(data: CommentData): Promise<String>
    editComment(data: Comments): Promise<CommentsModel[] | []>
    deleteComment(commentId: number): Promise<String>
}

class Comments {
    constructor(
        public id: number,
        public userId: number, 
        public upvotes: number,
        public downvotes: number,
        public comment: string,
        public chapterId: string,
    ) {}
}

class CommentsService implements ICommentsService {
    //Post
    async addChapterComment(data: CommentData): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data)
                    reject('Invalid data.')
                else {
                    let date = new Date()
                    const newComment = await prisma.comments.create({
                        data: {
                            user_id: data.user_id,
                            comment: data.comment,
                            chapter_id: data.chapter_id,
                            createdAt: date.toISOString(),
                            updatedAt: data.updatedAt || new Date().toISOString(),
                            upVotes: 0,
                            downVotes: 0,
                            edited: false,
                        }
                    })

                    if (newComment) {
                        resolve('Comment added successfully.')
                    }
                }
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(`Error: ${e.message}`)
                    reject(e)
                }
            }
        })
    }

    //Get
    async getChapterComments(chapterId: string): Promise<CommentsModel[]> {
        return new Promise(async (resolve, reject) => {
            try {
                //Get all comments
                if (chapterId === null)
                    reject('Invalid chapterId.')

                /*
                    TODO:
                    Cache the comments in a redis cache.
                */
                const comments = await prisma.comments.findMany({
                    where: { chapter_id: chapterId },
                    include: {
                        ruin_users: {
                        select: {
                                id: true,
                                username: true,
                            }
                        }
                    }
                }) as CommentsModel[]

                if (comments && comments.length > 0)
                    resolve(comments)
                else
                    reject('No comments found.')
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(`Error: ${e.message}`)
                    reject(e)
                }
            }
        })
    }

    //Update
    async editComment(data: Comments): Promise<CommentsModel[] | []> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!data)
                    reject('Invalid data.')

                /* TODO:
                    Only allow users to update their own comments. Use the userId to help. BULK requests
                 */
                const newComment = await prisma.comments.update({
                    where: { id: data.id },
                    data: { comment: data.comment, edited: true, updatedAt: new Date().toISOString() },
                }) as CommentsModel

                if (newComment) {
                    const comments = await prisma.comments.findMany({
                        where: { id: newComment.id }
                    }) as CommentsModel[]

                    resolve(comments)
                } else {
                    reject('No comments found.')
                    resolve([])
                }
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(`Error: ${e.message}`)
                    reject(e)
                }
            }
        })
    }

    //Delete
    async deleteComment(commentId: number): Promise<String> {
        return new Promise(async (resolve, reject) => {
            try {
                if (!commentId)
                    reject('Invalid commentId.')
                /* TODO:
                    Only allow users to delete their own comments. Use the userId to help. BULK requests.
                 */
                await prisma.comments.delete({
                    where: { id: commentId }
                })
                resolve('Comment deleted successfully.')
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(`Error: ${e.message}`)
                    reject(e)
                    resolve(e.message)
                }
            }
        })
    }
}

export default new CommentsService