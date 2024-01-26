import { logger } from "../../utils/logger"
import FavouritesModel from "../model/favourites.model"
import prisma from '../../utils/lib/prismaDB'
import DatabaseError from "../../utils/lib/database-error"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import { FavouriteData, Favourites } from "../../utils/interface"
import UserModel from "../model/user.model"


interface IFavouritesService {
    addToFavourites(favourite: FavouriteData): Promise<Favourites>
    getFavourites(user_id: number): Promise<FavouritesModel[]>
}

class FavouritesService implements IFavouritesService {
    async addToFavourites(favourite: FavouriteData): Promise<Favourites> {
        try {
            const {userName, comicTitle, comicID} = favourite

            //find user
            const user = await prisma.ruinUser.findFirst({ where: { username: userName } }) as UserModel;
            //create Favourite
            const favourites = (await prisma.favourites.create({
                data: {
                    user_id: user.id,
                    manga_title: comicTitle, 
                    comic_id: comicID,
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

    async getFavourites(user_id: number): Promise<FavouritesModel[]> {
        return new Promise(async (resolve, reject) => {
            try {
                //Get Favourites
                if (user_id === undefined) {
                    logger.info(`User id is undefined`)
                    resolve([])
                } else {
                    const favourites = await prisma.favourites.findMany({ where: { user_id: user_id } }) as FavouritesModel[]
                    if (favourites.length > 0)
                        resolve(favourites)
                    else
                        resolve([])
                }
            } catch (e) {
                if (e instanceof PrismaClientKnownRequestError) {
                    logger.error(`DBError: ${e}`)
                    reject(e)
                } else {
                    logger.error(`DBError: ${e}`)
                    reject(e)
                }
            }
        })
    }

}

export default new FavouritesService