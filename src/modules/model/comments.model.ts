import { RowDataPacket } from 'mysql2'

export default interface CommentsModel extends RowDataPacket {
    id: number;
    user_id: number;
    comment: string;
    chapter_id: string;
    createdAt: Date;
    updatedAt: Date;
    upVotes: number;
    downVotes: number;
    edited: boolean;
}