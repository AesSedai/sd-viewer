// import Masonry from "@mui/lab/Masonry"
import { Box, Typography } from "@mui/material"
import { isArray } from "radash"
import { useState } from "react"
import Masonry from "react-masonry-css"
import useAsyncEffect from "use-async-effect"
import { useKeyPress } from "../../hooks/useKeyPress"
import { useQuery } from "../../hooks/useQuery"
import { addPage, changePage } from "../../slices/resultSlice"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { Settings } from "../../types/settings"
import { Detail } from "../detail/detail"
import { Image } from "./image"
import "./imageGrid.css"

export const ImageGrid = (): JSX.Element => {
    const { error, refetch } = useQuery("", {}, { immediate: false })
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<Settings | null>(null)
    const startingTime = useAppSelector((state) => state.results.startingTime)
    const itemsPerPage = useAppSelector((state) => state.results.itemsPerPage)
    const currentPage = useAppSelector((state) => state.results.currentPage)
    const images = useAppSelector((state) => state.results.images)
    const leftPress = useKeyPress("ArrowLeft")
    const rightPress = useKeyPress("ArrowRight")
    const dispatch = useAppDispatch()

    // const { observe } = useInView({
    //     // For better UX, we can grow the root margin so the data will be loaded earlier
    //     rootMargin: "250px 0px",
    //     // When the last item comes to the viewport
    //     onEnter: async ({ unobserve, observe }) => {
    //         // Pause observe when loading data
    //         unobserve()
    //         // Load more data
    //         const result = await refetch({}, `SELECT * FROM images WHERE time < ${startingTime.toISO()} ORDER BY time DESC LIMIT ${itemsPerPage} START ${itemsPerPage * currentPage}`)
    //         console.log("result", result)
    //         if (result != null && (images.length === 0 || last(result as any[])?.id !== last(images)?.id)) {
    //             dispatch(append(result as Settings[]))
    //         }
    //         window.scrollTo(0, 0)
    //         observe()
    //     }
    // })

    useAsyncEffect(async () => {
        const result = await refetch(
            {},
            `SELECT * FROM images WHERE time < "${startingTime}" ORDER BY time DESC LIMIT ${itemsPerPage} START ${
                itemsPerPage * currentPage
            }`
        )
        if (result != null && !isArray(images[currentPage])) {
            dispatch(addPage({ page: 0, images: result as Settings[] }))
        }
    }, [])

    useAsyncEffect(async () => {
        if (leftPress || rightPress) {
            let newPage = -1
            if (leftPress && currentPage > 0) {
                newPage = currentPage - 1
            }
            if (rightPress && images[currentPage]?.length === itemsPerPage) {
                newPage = currentPage + 1
            }
            if (newPage != -1) {
                // has this page already been loaded?
                if (!isArray(images[newPage])) {
                    const result = await refetch(
                        {},
                        `SELECT * FROM images WHERE time < "${startingTime}" ORDER BY time DESC LIMIT ${itemsPerPage} START ${
                            itemsPerPage * newPage
                        }`
                    )
                    if (result != null) {
                        dispatch(addPage({ page: newPage, images: result as Settings[], newCurrentPage: newPage }))
                    }
                } else {
                    dispatch(changePage(newPage))
                }
                window.scrollTo(0, 0)
            }
        }
    }, [leftPress, rightPress])

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

    if (images[currentPage] == null || images[currentPage]?.length == 0) {
        return <></>
    }

    return (
        <>
            <Detail item={selected} open={open} onClose={handleClose}></Detail>
            <Box p={2}>
                <Typography variant="h3">{currentPage}</Typography>

                <Masonry breakpointCols={3} className="my-masonry-grid" columnClassName="my-masonry-grid_column">
                    {images[currentPage].map((item, idx) => (
                        <Box
                            key={item.id}
                            onClick={() => {
                                handleClickOpen(item)
                            }}>
                            <Image item={item} />
                        </Box>
                    ))}
                </Masonry>

                {/* <Masonry columns={8} spacing={1}>
                    {images[currentPage].map((item, idx) => (
                        <Box
                            key={item.id}
                            onClick={() => {
                                handleClickOpen(item)
                            }}>
                            <Image item={item} />
                        </Box>
                    ))}
                </Masonry> */}
            </Box>
            {/* <Box ref={observe}></Box> */}
        </>
    )
}
