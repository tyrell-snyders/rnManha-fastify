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
    addToFavourites(favourite: FavouritesModel): Promise<Favourites>
}

class FavouritesService implements IFavouritesService {
    async addToFavourites(favourite: FavouritesModel): Promise<Favourites> {
        try {
            const {user_id, manga_title, comic_id} = favourite
            const favourites = (await prisma.favourites.create({
                data: {
                    user_id,
                    manga_title, 
                    comic_id,
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