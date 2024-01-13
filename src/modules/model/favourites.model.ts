import { RowDataPacket } from 'mysql2'

export default interface FavouritesModel extends RowDataPacket {
    id: number;
    user_id: number;
    comic_id: string;
    manga_title: string;
}