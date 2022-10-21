import { Box } from "@mui/material"
import { useState } from "react"
import { useInView } from "react-cool-inview"
import Masonry from "react-masonry-css"
import { useQuery } from "../../hooks/useQuery"
import { push } from "../../slices/resultSlice"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Settings } from "../../types/settings"
import { Detail } from "../detail/detail"
import { Image } from "./image"
import "./imageGrid.css"

export const ImageGrid = (): JSX.Element => {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<Settings | null>(null)
    const oldestTime = useAppSelector((state) => state.results.oldestTime)
    const itemsPerPage = useAppSelector((state) => state.results.itemsPerPage)
    const images = useAppSelector((state) => state.results.images)
    const { error, refetch } = useQuery("", {}, { immediate: false })
    const dispatch = useAppDispatch()

    const { observe: observeEnd, unobserve: unobserveEnd } = useInView({
        threshold: 0,
        rootMargin: "250px 0px",
        onEnter: async ({ scrollDirection, entry, observe, unobserve }) => {
            // Triggered when the target enters the viewport
            const result = await refetch(
                {},
                `SELECT * FROM images WHERE time < ${oldestTime} ORDER BY time DESC LIMIT ${itemsPerPage}`
            )
            if (result != null) {
                dispatch(push({ images: result as Settings[] }))
            }
        }
    })

    // const interval = useInterval(async () => {
    //     console.log("startingTime", store.getState().results.startingTime)
    //     const result = await refetch(
    //         {},
    //         `SELECT * FROM images WHERE time > ${
    //             store.getState().results.startingTime
    //         } ORDER BY time DESC LIMIT ${itemsPerPage}`
    //     )
    //     if (result != null && result?.length > 0) {
    //         console.log("unshifting new images", result)
    //         dispatch(unshift({ images: result as Settings[] }))
    //     }
    // }, 10000)

    // const { observe: observeStart } = useInView({
    //     threshold: 0,
    //     onChange: async ({ inView, scrollDirection, entry, observe, unobserve }) => {
    //         console.log("inView", inView, "active", interval.active)
    //         if (inView && !interval.active) {
    //             interval.start()
    //         } else {
    //             interval.stop()
    //         }
    //     }
    // })

    const handleClickOpen = (item: any) => {
        setOpen(true)
        setSelected(item)
    }

    const handleClose = () => {
        setOpen(false)
        setSelected(null)
    }

    if (error != null && error != false) {
        console.log("error", error)
    }

    return (
        <>
            <Detail item={selected} open={open} onClose={handleClose}></Detail>
            <Box>
                {/* <Box ref={observeStart}></Box> */}
                <Masonry breakpointCols={8} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                    {(images ?? []).map((item, idx) => (
                        <Box
                            key={item.id}
                            onClick={() => {
                                handleClickOpen(item)
                            }}>
                            <Image item={item} />
                        </Box>
                    ))}
                    <Box ref={observeEnd}></Box>
                </Masonry>
            </Box>
        </>
    )
}
