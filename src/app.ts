import { config } from "./utils/config"
import { createServer } from "./utils/createServer"
import { logger } from "./utils/logger"

const signals = ["SIGINT", "SIGTERM", "SIGHUP"] as const

async function gracefuleShutdown({signal, server}: { 
    signal: typeof signals[number],
    server: Awaited<ReturnType<typeof createServer>>
}) {
    logger.info(`Got Signal: ${signal}. Shutting down...`)
    await server.close()
    process.exit(0)
}

async function startServer() {
    const server = await createServer()

    server.listen({
        port: config.PORT,
        host: config.HOST,
    })
    
    logger.info(`App is listening`)

    for (let i=0; i < signals.length; i++) {
        process.on(signals[i], () => gracefuleShutdown({
            signal: signals[i],
            server
        }))
    }
}

startServer()