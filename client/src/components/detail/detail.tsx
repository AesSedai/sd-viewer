import { Box, Dialog, DialogTitle, Typography } from "@mui/material"
import { DateTime } from "luxon"
import { Settings } from "../../types/settings"

interface Props {
    item: Settings | null
    open: boolean
    onClose: () => void
}

export const Detail = (props: Props): JSX.Element => {
    const { item, open, onClose } = props

    if (item == null) {
        return <></>
    }

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{item.prompt}</DialogTitle>
            <img
                src={encodeURI(`http://localhost:4000${item.path.replace(/\.yaml|\.txt/, ".png")}`)}
                srcSet={encodeURI(`http://localhost:4000${item.path.replace(/\.yaml|\.txt/, ".png")}`)}
                alt={item.prompt}
                loading="lazy"
            />
            <Box p={2}>
                <Typography variant="subtitle1">Sampler: {item.sampler_name}</Typography>
                <Typography variant="subtitle1">Seed: {item.seed}</Typography>
                <Typography variant="subtitle1">CFG: {item.cfg_scale}</Typography>
                <Typography variant="subtitle1">Steps: {item.ddim_steps}</Typography>
                <Typography variant="subtitle1">
                    Dimensions: {item.width}x{item.height}
                </Typography>
                <Typography variant="subtitle1">
                    Time: {DateTime.fromISO(item.time.replaceAll('"', "")).toLocaleString(DateTime.DATETIME_FULL)}
                </Typography>
            </Box>
        </Dialog>
    )
}
