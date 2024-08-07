import { logger } from "../../utils/logger"
import UserDTOModel from "../model/DTO/userDTO.model"
import UserModel from "../model/user.model"
import bcrypt from 'bcrypt'
import prisma from '../../utils/lib/prismaDB'
import { avatarDTO } from "../model/DTO/avatar.model"

interface IUserService {
    registerUser(user: UserModel): Promise<UserModel>
    getAllUsers(): Promise<UserModel[]>
    getUserById(id: number): Promise<UserModel>
    loginUser(user: UserDTOModel): Promise<UserModel[]>
    addAvatar(data: avatarDTO): void
}

class UserService implements IUserService {
    getUserById(id: number): Promise<UserModel> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await prisma.ruinUser.findUnique({ where: { id: id } }) as UserModel
                if (user) {
                    resolve(user)
                } else {
                    reject()
                }
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(`Error: ${e.message}`)
                    reject(e)
                }   
            }
        })
    }

    async registerUser(user: UserModel): Promise<UserModel> {
        //Password Encryption
        const genSalt = await bcrypt.genSalt(10)
        const pass = await bcrypt.hash(user.pass, genSalt)

        return new Promise(async (resolve, reject) => {
            try {
                //Create new user
                const newUser = await prisma.ruinUser.create({
                    data: {
                        username: user.username,
                        email: user.email,
                        pass
                    }
                })

                if (newUser) {
                    const dbUser = { ...user, id: newUser.id }
                    resolve(dbUser)
                }
            } catch (e) {
                if (e instanceof Error) {
                    logger.error(`Error: ${e.message}`)
                    reject(e)
                }
            }
        })
    }

    async getAllUsers(): Promise<UserModel[]> {
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

    async addAvatar(data: avatarDTO): Promise<void> {
        try {
            const { userId, imageUrl } = data
            console.log(imageUrl)
            const avatar = await prisma.avatars.create({
                data: {
                    userId,
                    imageUrl
                }
            })

            if (avatar) {
                logger.info(`Avatar added to user ${userId}`)
            } else {
                logger.error(`Error adding avatar to user ${userId}`)
            }
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`Error: ${e.message}`)
            }
        }
    }
}

export default new UserService