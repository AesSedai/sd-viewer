import { NextFunction, Request, Response, Router } from "express"
import { db } from "../utils/database"

export class ImageRouter {
    router: Router

    constructor() {
        this.router = Router()
        this.init()
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        const result = await db.query("SELECT * FROM images ORDER BY time DESC LIMIT 10;")
        res.send(result)
    }

    // public getOne(req: Request, res: Response, next: NextFunction) {
    //     const query = parseInt(req.params.id, 10)
    //     const user = users.find((user) => user.id === query)
    //     if (user) {
    //         res.status(200).send({
    //             message: "Success",
    //             status: res.status,
    //             user
    //         })
    //     } else {
    //         res.status(404).send({
    //             message: NO_USER_WITH_ID,
    //             status: res.status
    //         })
    //     }
    // }

    init() {
        this.router.get("/", this.getAll)
        // this.router.get("/:id", this.getOne)
    }
}

// Create the ImageRoutes, and export its configured Express.Router
const imageRoutes = new ImageRouter()
imageRoutes.init()

export default imageRoutes.router
