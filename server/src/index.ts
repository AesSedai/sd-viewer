import * as http from "http"
import App from "./app"
import { initWatcher } from "./utils/watcher"

const onError = (error: NodeJS.ErrnoException): void => {
    console.log("err", error)
    throw error
}

const port = 4000
App.set("port", port)

const server = http.createServer(App)
server.listen(port)
server.on("error", onError)

initWatcher()
