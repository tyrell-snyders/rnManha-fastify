import * as jwt from 'jsonwebtoken'
import { FastifyRequest, FastifyReply } from "fastify"
import { config } from './config'

export default async (req: FastifyRequest, reply: FastifyReply) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        reply.code(401).send({ message: 'Unauthorized' }) 
        return
    }

    const token = authHeader.replace('Bearer', '')

    //Verify the token
    try {
        const decoded = jwt.verify(token, config.SECRET_KEY_TOKEN)
    } catch (e) {
        reply.code(401).send({ message: 'Unauthorized' })
        return
    }
}