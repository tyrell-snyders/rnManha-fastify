import { logger } from "../../utils/logger"
import { connection } from "../../utils/mysql"
import UserModel from "../model/user.model"
import { OkPacketParams, OkPacket, ResultSetHeader } from "mysql2" 


interface IUserService {
    registerUser(user: UserModel): Promise<UserModel>
    getAllUsers(): Promise<UserModel[]>
    // loginUser(user: UserModel): Promise<string>
}

class UserService implements IUserService {
    registerUser(user: UserModel): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `INSERT INTO (username, email, pass) VALUES(?,?,?);`,
                [user.username, user.email, user.pass],
                (e, res) => {
                    if (e) {
                        logger.error(`Could not insert user into database: ${e.message}`)
                        reject(e)
                    }
                }
            )
        })
    }

    getAllUsers(): Promise<UserModel[]> {
        let query: string = 'SELECT * FROM ruin_users;'

        return new Promise((resolve, reject) => {
            connection.query<UserModel[]>(query, (e, res) => {
                if (e) {
                    logger.error(`Could not insert user into database: ${e.message}`)
                    reject(e)
                } else
                    resolve(res)
            })
        })
    }
    // loginUser(user: UserModel): Promise<string> {
    //     throw new Error("Method not implemented.")
    // }
    
}

export default new UserService