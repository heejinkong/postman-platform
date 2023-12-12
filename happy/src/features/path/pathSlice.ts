import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

type pathState = {
    path: {
        expanded: string[]
        selected: string
    }
}

const initialState: pathState = {
    path: {
        expanded: [],
        selected: ''
    }
}

const pathSlice = createSlice({
    name: 'path',
    initialState: initialState,
    reducers: {
        setPathExpanded: (state, action: PayloadAction<string[]>) => {
            state.path.expanded = action.payload
        },
        setPathSelected: (state, action: PayloadAction<string>) => {
            state.path.selected = action.payload
        }
    }
})

export const pathAction = pathSlice.actions

export const selectPathExpanded = (state: RootState) => state.path.path.expanded
export const selectPathSelected = (state: RootState) => state.path.path.selected
export const selectPath = (state: RootState) => state.path.path

export default pathSlice.reducer