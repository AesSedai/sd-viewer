import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DateTime } from "luxon"
import { last } from "radash"
import { Settings } from "../types/settings"

interface resultSliceType {
    startingTime: number
    oldestTime: number
    itemsPerPage: number
    images: Settings[]
}

const initialState: resultSliceType = {
    startingTime: DateTime.now().toUTC().toMillis(),
    oldestTime: DateTime.now().toUTC().toMillis(),
    itemsPerPage: 250,
    images: []
}

interface Push {
    images: Settings[]
}

interface Unshift {
    images: Settings[]
}

export const resultSlice = createSlice({
    name: "result",
    initialState,
    reducers: {
        push: (state, action: PayloadAction<Push>) => {
            state.images.push(...action.payload.images)
            state.oldestTime = last(state.images).time
        },
        unshift: (state, action: PayloadAction<Unshift>) => {
            state.images.unshift(...action.payload.images)
            state.startingTime = state.images[0].time
        }
    }
})

// Action creators are generated for each case reducer function
export const { push, unshift } = resultSlice.actions

export default resultSlice.reducer
