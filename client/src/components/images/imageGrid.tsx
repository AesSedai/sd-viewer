import { Box } from "@mui/material"
import { isArray } from "radash"
import { useState } from "react"
import { useInView } from "react-cool-inview"
import Masonry from "react-masonry-css"
import { useQuery } from "../../hooks/useQuery"
import { addPage } from "../../slices/resultSlice"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Settings } from "../../types/settings"
import { Detail } from "../detail/detail"
import { Image } from "./image"
import "./imageGrid.css"

export const ImageGrid = (): JSX.Element => {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<Settings | null>(null)
    const currentPage = useAppSelector((state) => state.results.currentPage)
    const startingTime = useAppSelector((state) => state.results.startingTime)
    const itemsPerPage = useAppSelector((state) => state.results.itemsPerPage)
    const images = useAppSelector((state) => state.results.images.flat())
    const { error, refetch } = useQuery("", {}, { immediate: false })
    const dispatch = useAppDispatch()

    const { observe, unobserve, inView, scrollDirection, entry } = useInView({
        threshold: 0.75,
        rootMargin: "10px 0px",
        onEnter: async ({ scrollDirection, entry, observe, unobserve }) => {
            // Triggered when the target enters the viewport
            const result = await refetch(
                {},
                `SELECT * FROM images WHERE time < "${startingTime}" ORDER BY time DESC LIMIT ${itemsPerPage} START ${
                    itemsPerPage * (currentPage + 1)
                }`
            )
            if (result != null && !isArray(images[currentPage + 1])) {
                dispatch(
                    addPage({ page: currentPage + 1, images: result as Settings[], newCurrentPage: currentPage + 1 })
                )
            }
        }
    })

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
                <Masonry breakpointCols={8} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                    {(images ?? []).map((item) => (
                        <Box
                            key={item.id}
                            onClick={() => {
                                handleClickOpen(item)
                            }}>
                            <Image item={item} />
                        </Box>
                    ))}
                    <Box ref={observe}></Box>
                </Masonry>
            </Box>
        </>
    )
}
