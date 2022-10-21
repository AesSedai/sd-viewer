import compression from "compression"
import cookieParser from "cookie-parser"
import cors from "cors"
import express from "express"
import morgan from "morgan"
import ImageRouter from "./routes/ImageRouters"
import { env } from "./utils/validateEnv"

// Creates and configures an ExpressJS web server.
class App {
    // ref to Express instance
    public express: express.Application

    // Run configuration methods on the Express instance.
    constructor() {
        this.express = express()
        this.middleware()
        this.routes()
    }

    // Configure Express middleware.
    private middleware() {
        // if (env.NODE_ENV === "production") {
        //     this.express.use(morgan("combined"))
        //     this.express.use(cors({ origin: "your.domain.com", credentials: true }))
        // } else if (env.NODE_ENV === "development") {
        //     this.express.use(morgan("dev"))
        //     this.express.use(cors({ origin: true, credentials: true }))
        // }
        // static content, watched files
        this.express.use(compression())
        this.express.use("/watch", express.static("/watch"))

        this.express.use(express.json())
        this.express.use(express.urlencoded({ extended: true }))
        this.express.use(cookieParser())
    }

    // Configure API endpoints.
    private routes() {
        let router: express.Router = express.Router()
        // placeholder route handler
        router.get("/", (req: express.Request, res: express.Response) => {
            res.json({
                message: "Hello World!"
            })
        })
        this.express.use("/", router)
        this.express.use("/api/images", ImageRouter)
    }
}

export default new App().express
