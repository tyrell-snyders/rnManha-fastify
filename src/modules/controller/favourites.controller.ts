import { logger } from "../../utils/logger"
import { FastifyRequest, FastifyReply } from "fastify"
import favouritesService from "../services/favourites.service";
// import FavouritesModel from "../model/favourites.model";
import { FavouriteData } from "../../utils/interface";

export default class FavouritesController {
    async addFavouriteHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "POST");

        try {
            const favourites = await favouritesService.addToFavourites(req.body as FavouriteData);
            return reply.code(201).send({
                favourites
            })
        } catch (error) {
            logger.error(error, `addFavouriteHandler error`);
            return reply.code(500).send({
                message: "Error adding favourite",
                error
            });
        }
    }

    async getFavouritesHandler(req: FastifyRequest, reply: FastifyReply) {
        reply.header("Access-Control-Allow-Origin", "*");
        reply.header("Access-Control-Allow-Methods", "GET");

        try {
            const { user_id } = req.query as { user_id: number }
            const favourites = await favouritesService.getFavourites(user_id);

            return reply.code(200).send({
                favourites
            })
        } catch (error) {
            logger.error(error);
            return reply.code(500).send({
                message: "Error getting favourites",
                error
            });
        }
    }
}

