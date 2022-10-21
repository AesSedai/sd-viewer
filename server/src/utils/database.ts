import Surreal from "surrealdb.js"
import { env } from "./validateEnv"

const db = new Surreal(env.DB_URL)

try {
    await db.signin({
        user: env.DB_USER,
        pass: env.DB_PASS
    })

    await db.use("test", "test")

    await db.query("DEFINE TABLE images SCHEMAFULL;")

    await db.query("DEFINE FIELD path ON images TYPE string;")
    await db.query("DEFINE FIELD time ON images TYPE number;")
    await db.query("DEFINE FIELD batch_size ON images TYPE number;")
    await db.query("DEFINE FIELD cfg_scale ON images TYPE number;")
    await db.query("DEFINE FIELD ddim_eta ON images TYPE number;")
    await db.query("DEFINE FIELD ddim_steps ON images TYPE number;")
    await db.query("DEFINE FIELD height ON images TYPE number;")
    await db.query("DEFINE FIELD width ON images TYPE number;")
    await db.query("DEFINE FIELD n_iter ON images TYPE number;")
    await db.query("DEFINE FIELD prompt ON images TYPE string;")
    await db.query("DEFINE FIELD sampler_name ON images TYPE string;")
    await db.query("DEFINE FIELD seed ON images TYPE number;")
    await db.query("DEFINE FIELD target ON images TYPE string;")
    await db.query("DEFINE FIELD imgExt ON images TYPE string;")

    await db.query("DEFINE INDEX idx_path ON images COLUMNS path UNIQUE;")
    await db.query("DEFINE INDEX idx_time ON images COLUMNS time;")
} catch (e) {
    console.log("unable to signin to db:", e)
    throw e
}

export { db }
