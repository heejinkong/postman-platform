import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

type configState = {
  navTree: {
    expanded: string[]
    selected: string
  }
}

const initialState: configState = {
  navTree: {
    expanded: [],
    selected: ''
  }
}

const configSlice = createSlice({
  name: 'config',
  initialState: initialState,
  reducers: {
    setExpanded: (state, action: PayloadAction<string[]>) => {
      state.navTree.expanded = action.payload
    },
    setSelected: (state, action: PayloadAction<string>) => {
      state.navTree.selected = action.payload
    }
  }
})

export const { setExpanded, setSelected } = configSlice.actions

export const selectNavTreeExpanded = (state: RootState) => state.config.navTree.expanded
export const selectNavTreeSelected = (state: RootState) => state.config.navTree.selected

export default configSlice.reducer
