import { describe, it, vi, expect } from 'vitest'
import { createServer } from '../../utils/createServer'
import userService from '../services/user.service'
import UserModel from '../model/user.model'

describe('Post "/api/auth/register" route', () => {
    it('should call the registerUser service', async () => {

        let user: UserModel = {
            username: "mock username",
            email: "mock email",
            pass: "mock pass"
        }  as UserModel

        const registerUserSpy = vi.spyOn(userService, 'registerUser')
        expect(registerUserSpy.getMockName()).toEqual('registerUser')

        registerUserSpy.mockResolvedValue(user)

        const server = await createServer()
        await server.ready()

        const payload = {
            "username": "gamerTage",
            "email": "gamer@gmail.com",
            "pass": "myPassword123"
        }

        const response = await server.inject({
            method: 'POST',
            url: '/api/auth/register',
            payload
        })
    })
})