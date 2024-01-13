import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import favouritesController from '../controller/favourites.controller'

export function favouritesRoute(
    app: FastifyInstance,
    options: FastifyPluginOptions,
    done: () => void
) {
    const controller = new favouritesController()
    app.post('/', {
        schema: {
            description: 'Add a favourite comic',
            tags: ['Favourites'],
            body: {
                type: 'object',
                    properties: {
                        user_id: { type: 'number' },
                        comic_id: { type:'string' },
                        manga_title: { type:'string' }
                    },
                required: ['user_id', 'comic_id','manga_title']
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