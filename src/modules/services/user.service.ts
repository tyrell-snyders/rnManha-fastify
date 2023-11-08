import { logger } from "../../utils/logger"
import { connection } from "../../utils/mysql"
import UserDTOModel from "../model/DTO/userDTO.model"
import UserModel from "../model/user.model"
import { ResultSetHeader } from "mysql2" 
import bcrypt from 'bcrypt'
import prisma from '../../utils/lib/prismaDB'

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

        return new Promise(async (resolve, reject) => {
            try {
                //Get all users
                const dbUsers = await prisma.ruinUser.findMany({}) as UserModel[]
                if (dbUsers.length > 0)
                    resolve(dbUsers)
                else
                    resolve([])
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(`Error: ${e.message}`)
                    reject(e)
                }
            }
        })
    }

    async loginUser(user: UserDTOModel): Promise<UserModel[]> {
        if (!user) {
            // Handle the case where user is undefined
            throw new Error('User is undefined');
        }   

        return new Promise(async (resolve, reject) => {
                try {
                    //Find user with username
                    const dbUser = await prisma.ruinUser.findFirst({
                        where: { username: user.username }
                    }) as UserModel;
                    const { pass, ...secureUser } = dbUser;
                    const passwordValidation = await bcrypt.compare(user.pass, dbUser?.pass)
                    if (passwordValidation) {
                        // Passwords match, return the user without the password
                        resolve([secureUser as UserModel]);
                    } else {
                        // User not found, return empty array
                        resolve([])
                    }
                } catch (e) {
                    if (e instanceof Error) {
                        console.log(e.message)
                        reject(e)
                    }
                }
        });
    }
}

export default new UserService