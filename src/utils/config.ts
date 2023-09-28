import envSchema from "env-schema"
import { Type, Static } from "@sinclair/typebox"

const schema = Type.Object({
    PORT: Type.Number({
        default: 4000
    }),
    HOST: Type.String({
        default: '0.0.0.0'
    }),
    DB_USER: Type.String({
        default: 'root'
    }),
    DB_PASS: Type.String(),
    DB_NAME: Type.String(),
    DB_HOST: Type.String({
        default: 'localhost'
    }),
    DB_PORT: Type.Number({
        default: 3306
    })
})

type Env = Static<typeof schema>

export const config = envSchema<Env>({
    schema,
    dotenv: true
})