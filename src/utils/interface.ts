import FavouritesModel from "../modules/model/favourites.model";

export interface Favourites {
    Favourites: FavouritesModel;
    message: string;
}

export interface FavouriteData {
    userName: string;
    comicID: string;
    comicTitle: string;
}

export interface CommentData {
    user_id: number;
    comment: string;
    chapter_id: string;
    createdAt: Date;
    updatedAt: Date;
    upVotes: number;
    downVotes: number;
    edited: Boolean;
}