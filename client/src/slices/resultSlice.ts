import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DateTime } from "luxon"
import { Settings } from "../types/settings"

interface resultSliceType {
    startingTime: string
    oldestTime: string
    itemsPerPage: number
    currentPage: number
    images: Settings[][]
}

const initialState: resultSliceType = {
    startingTime: DateTime.now().toISO(),
    oldestTime: DateTime.now().toISO(),
    itemsPerPage: 250,
    currentPage: -1,
    images: []
}

interface AddPage {
    page: number
    images: Settings[]
    newCurrentPage?: number
}

export const resultSlice = createSlice({
    name: "result",
    initialState,
    reducers: {
        addPage: (state, action: PayloadAction<AddPage>) => {
            state.images[action.payload.page] = action.payload.images
            if (action.payload.newCurrentPage != null) {
                state.currentPage = action.payload.newCurrentPage
            }
        },
        changePage: (state, action: PayloadAction<number>) => {
            state.currentPage = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { addPage, changePage } = resultSlice.actions

export default resultSlice.reducer
