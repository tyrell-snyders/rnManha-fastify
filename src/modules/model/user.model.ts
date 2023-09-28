import { RowDataPacket } from 'mysql2'

export default interface UserModel extends RowDataPacket {
    username: string;
    email: string;
    pass: string;
}