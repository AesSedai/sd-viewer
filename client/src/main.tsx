import createCache from "@emotion/cache"
import { CacheProvider } from "@emotion/react"
import CssBaseline from "@mui/material/CssBaseline"
import {
    // unstable_createMuiStrictModeTheme as createMuiTheme,
    createTheme,
    ThemeProvider
} from "@mui/material/styles"
import { createRoot } from "react-dom/client"
import { Provider } from "react-redux"
import Surreal from "surrealdb.js"
import { App } from "./App"
import { DatabaseProvider } from "./context/database"
import { store } from "./store/store"

const db = new Surreal("http://127.0.0.1:8000/rpc")

export const muiCache = createCache({
    key: "mui",
    prepend: true
})

const darkTheme = createTheme({
    palette: {
        mode: "dark"
    }
})

createRoot(document.getElementById("root") as HTMLElement).render(
    <CacheProvider value={muiCache}>
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            <Provider store={store}>
                <DatabaseProvider
                    database={db}
                    options={{ user: "root", pass: "root", namespace: "test", database: "test" }}>
                    <App />
                </DatabaseProvider>
            </Provider>
        </ThemeProvider>
    </CacheProvider>
)
