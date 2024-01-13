import { logger } from "../../utils/logger"
import FavouritesModel from "../model/favourites.model"
import prisma from '../../utils/lib/prismaDB'
import DatabaseError from "../../utils/lib/database-error"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"

interface Favourites {
    Favourites: FavouritesModel;
    message: string;
}

interface IFavouritesService {
    addToFavourites(userID: number, mangaID: string, mangaTitle: string): Promise<Favourites>
}

class FavouritesService implements IFavouritesService {
    async addToFavourites(userID: number, mangaID: string, mangaTitle: string): Promise<Favourites> {
        try {
        const favourites = (await prisma.favourites.create({
            data: {
            user_id: userID,
            manga_title: mangaTitle,
            comic_id: mangaID,
            },
        })) as FavouritesModel;

        logger.info(`Favourite added successfully!`);

        const fav: Favourites = {
            Favourites: favourites,
            message: "Favourite added successfully!",
        };

        return fav;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                // Handle known DB errors
                logger.error("Error creating favourite", error.message);
                return {
                Favourites: null as unknown as FavouritesModel,
                message: new DatabaseError("Unique constraint failed").message,
                };
            } else {
                // Unknown error
                logger.error("Error creating favourite", error);
                return {
                Favourites: null as unknown as FavouritesModel,
                message: new DatabaseError("Unknown database error").message,
                };
            }
        }
    }

}

export default new FavouritesService