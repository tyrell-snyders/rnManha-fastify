import { logger } from "../../utils/logger"
import { FastifyRequest, FastifyReply } from "fastify"
import favouritesService from "../services/favourites.service";
import FavouritesModel from "../model/favourites.model";

export default class FavouritesController {
  async addFavouriteHandler(req: FastifyRequest, reply: FastifyReply) {
    reply.header("Access-Control-Allow-Origin", "*");
    reply.header("Access-Control-Allow-Methods", "POST");

    try {
        const favourites = await favouritesService.addToFavourites(req.body as FavouritesModel);
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
}