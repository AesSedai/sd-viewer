import { configureStore } from "@reduxjs/toolkit"
import resultsReducer from "../slices/resultSlice"

export const store = configureStore({
    reducer: {
        results: resultsReducer
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {counter: CounterState}
export type AppDispatch = typeof store.dispatch
