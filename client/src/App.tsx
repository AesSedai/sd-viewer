import { Typography } from "@mui/material"
import { useContext } from "react"
import { ImageGrid } from "./components/images/imageGrid"
import { SurrealContext, SurrealContextType } from "./context/database"

export const App = (): JSX.Element => {
    const { isReady } = useContext<SurrealContextType>(SurrealContext)

    if (isReady) {
        return <ImageGrid></ImageGrid>
    } else {
        return <Typography>Initializing...</Typography>
    }
}
