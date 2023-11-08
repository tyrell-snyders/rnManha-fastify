import { RowDataPacket } from 'mysql2'

export default interface UserModel extends RowDataPacket {
    id: number;
    username: string;
    email: string;
    pass: string;
}