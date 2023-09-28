import mysql, { ConnectionOptions } from 'mysql2'
import { config } from './config'
import { logger } from './logger'
import { Connection } from 'mysql2/typings/mysql/lib/Connection'

const access: ConnectionOptions = {
    host: config.DB_HOST,
    user: config.DB_USER,
    password: config.DB_PASS,
    database: config.DB_NAME
}
const connection = mysql.createConnection(access)

const Query = async (connection: Connection, query: string) => new Promise((resolve, reject) => {
    connection.query(query, connection, (err, res) => {
        if (err) {
            reject(err)
                logger.error(`Error Executing query: ${err.message}`)
            process.exit(1)
        }
        resolve(connection)
        logger.info(`Successfully Executed Query.`)
    })
})

export { connection, Query }
