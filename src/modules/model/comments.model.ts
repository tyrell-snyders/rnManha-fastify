import { RowDataPacket } from 'mysql2'

export default interface CommentsModel extends RowDataPacket {
    id: number;
    comment: string;
    user_id: number | null;
    chapter_id: string;
    createdAt: Date;
    updatedAt: Date;
    upVotes: number | null;
    downVotes: number | null;
    edited: boolean | null;
    ruin_users: {
        id: number;
        username: string;
        email: string;
    } | null;
}