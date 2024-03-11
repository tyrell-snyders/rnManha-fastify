import { RowDataPacket } from 'mysql2'

export default interface CommentsModel {
    id: number;
    user_id: number;
    downvotes: number;
    upvotes: number;
    comments: string;
    chapterId: string;
    createdAt: string;
    updatedAt: string;
}