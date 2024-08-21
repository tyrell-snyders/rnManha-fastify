import { logger } from "../../utils/logger"
import UserDTOModel from "../model/DTO/userDTO.model"
import UserModel from "../model/user.model"
import bcrypt from 'bcrypt'
import prisma from '../../utils/lib/prismaDB'
import { avatarDTO } from "../model/DTO/avatar.model"
import { getAvatar }  from '../../utils/lib/avatar'

interface IUserService {
    registerUser(user: UserModel): Promise<UserModel>
    getAllUsers(): Promise<UserModel[]>
    getUserById(id: number): Promise<UserModel>
    loginUser(user: UserDTOModel): Promise<UserModel[]>
}

class UserService implements IUserService {
    getUserById(id: number): Promise<UserModel> {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await prisma.ruinUser.findUnique({ 
                    where: { id: id }, 
                    include: { 
                        avatars: {
                            select: {
                                id: true,
                                imageUrl: true,
                            }
                        }
                    } 
                }) as UserModel

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

        //Test data used to create user
        // {
            // "username": "DonTheLiver",
            // "email": "don@music.com",
            // "pass": "Music123"
        // }
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

                //Create new user avatar
                const avatar = getAvatar(`${user.username}.${user.id}/${user.email.split('@' || '.')[0]}`)
                await prisma.avatars.create({
                    data: {
                        imageUrl: avatar,
                        userId: newUser.id
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
        try {
            // Get all users with their avatars
            const dbUsers = await prisma.ruinUser.findMany({
                include: { 
                    avatars: {
                        select: {
                            id: true,
                            imageUrl: true,
                            userId: true
                        }
                    }
                }
            }) as UserModel[];

            return dbUsers.length > 0 ? dbUsers : [];
        } catch (e) {
            if (e instanceof Error) {
                logger.error(`Error: ${e.message}`);
            }
            throw e;
        }
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