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