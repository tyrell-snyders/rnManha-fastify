import { logger } from "../../utils/logger"
import { connection } from "../../utils/mysql"
import UserDTOModel from "../model/DTO/userDTO.model"
import UserModel from "../model/user.model"
import { ResultSetHeader } from "mysql2" 


interface IUserService {
    registerUser(user: UserModel): Promise<UserModel>
    getAllUsers(): Promise<UserModel[]>
    loginUser(user: UserDTOModel): Promise<UserModel[]>
}

class UserService implements IUserService {
    registerUser(user: UserModel): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `INSERT INTO ruin_users (username, email, pass) VALUES(?,?,?);`,
                [user.username, user.email, user.pass],
                (e, res) => {
                    if (e) {
                        logger.error(`Could not insert user into database: ${e.message}`)
                        reject(e)
                    } else {    
                        const insertedUser = { ...user, id: res.insertId };
                        resolve(insertedUser);
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

    loginUser(user: UserDTOModel): Promise<UserModel[]> {
        let query: string = `SELECT * FROM ruin_users WHERE username='${user.username}' AND pass='${user.pass}';`

        return new Promise((resolve, reject) => {
            connection.query<UserModel[]>(query, (e, res) => {
                if (e) {
                    logger.error(`User not found: ${e.message}`)
                    reject(e)
                } else {
                    resolve(res)
                }
            })
        })
    }
    
}

export default new UserService