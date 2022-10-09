import { cleanEnv, port, str } from "envalid"

export const env = cleanEnv(process.env, {
    NODE_ENV: str({ default: "development" }),
    PORT: port({ default: 4000 }),
    DB_URL: str({ default: "db:8000" }),
    DB_USER: str({ default: "root" }),
    DB_PASS: str({ default: "root" })
})

export const validateEnv = () => env
