import mysql, { ConnectionOptions } from 'mysql2'
import { config } from './config'
import { logger } from './logger'
import { Connection } from 'mysql2/typings/mysql/lib/Connection'

const connectToDB = async () => new Promise<Connection>((resolve, reject) => {
    const access: ConnectionOptions = {
        user: config.DB_USER,
        database: 'test'
    }
    const connection = mysql.createConnection(access)

    connection.connect((e) => {
        if (e) {
            reject(e)
                logger.error(`Error connecting to database: ${e.message}`)
            process.exit(1)
        }
        resolve(connection)
        logger.info(`Connected To Database`)
    })
})

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

export { connectToDB, Query }
