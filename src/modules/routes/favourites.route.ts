import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import favouritesController from '../controller/favourites.controller'
import validateToken from '../../utils/validateToken'

export function favouritesRoute(
    app: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void
) {
    const controller = new favouritesController()
    app.get('/get-favourites', {
        schema: {
            description: 'Get all user favourites',
            tags: ['Favourites'],
            querystring: {
                type: 'object',
                properties: {
                    user_id: { type: 'number' }
                },
                required: ['user_id']
            },
            response: {
                200: {
                    type: 'object',
                    properties: {
                        favourites: {
                            type: 'array' 
                        }
                    }
                },
                500: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, controller.getFavouritesHandler)

    app.post('/add', {
        schema: {
            description: 'Add a favourite comic',
            tags: ['Favourites'],
            body: {
                type: 'object',
                    properties: {
                        userName: { type: 'string' },
                        comicID: { type:'string' },
                        comicTitle: { type:'string' }
                    },
                required: ['userName', 'comicID','comicTitle']
            },
            response: {
                201: {
                    type: 'object',
                    properties: {
                        favourites: {
                            id: Number,
                            user_id: Number,
                            comic_id: String,
                            manga_title: String
                        }
                    }
                },
                500: {
                    type: 'object',
                    properties: {
                        message: { type: 'string' }
                    }
                }
            }
        }
    }, controller.addFavouriteHandler)

    done()
}