import { logger } from "../../utils/logger"
import { connection } from "../../utils/mysql"
import UserDTOModel from "../model/DTO/userDTO.model"
import UserModel from "../model/user.model"
import { ResultSetHeader } from "mysql2" 
import bcrypt from 'bcrypt'

interface IUserService {
    registerUser(user: UserModel): Promise<UserModel>
    getAllUsers(): Promise<UserModel[]>
    loginUser(user: UserDTOModel): Promise<UserModel[]>
}

class UserService implements IUserService {
    async registerUser(user: UserModel): Promise<UserModel> {
        //Password Encryption
        const genSalt = await bcrypt.genSalt(10)
        const pass = await bcrypt.hash(user.pass, genSalt)

        return new Promise((resolve, reject) => {
            connection.query<ResultSetHeader>(
                `INSERT INTO ruin_users (username, email, pass) VALUES(?,?,?);`,
                [user.username, user.email, pass],
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

    async getAllUsers(): Promise<UserModel[]> {
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

    async loginUser(user: UserDTOModel): Promise<UserModel[]> {
        if (!user) {
            // Handle the case where user is undefined
            throw new Error('User is undefined');
        }   

        const query: string = `SELECT * FROM ruin_users WHERE username='${user.username}';`;

        return new Promise((resolve, reject) => {
            connection.query<UserModel[]>(query, async (e, res) => {
                if (e) {
                    logger.error(`Error querying user: ${e.message}`);
                    reject(e);
                } else {
                    if (res.length === 0) {
                        // User not found
                        resolve([]);
                    } else {
                        const dbUser = res[0];

                        // Remove the password field from the user object
                        const { pass, ...secureUser } = dbUser;

                        const passwordValidation = await bcrypt.compare(user.pass, dbUser.pass);
                        if (passwordValidation) {
                            // Passwords match, return the user without the password
                            resolve([secureUser as UserModel]);
                        } else {
                            // Passwords do not match
                            resolve([]);
                        }
                    }
                }
            });
        });
    
    }
}

export default new UserService