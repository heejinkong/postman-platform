import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

type configState = {
  workspace: {
    navTree: {
      expanded: string[]
      selected: string
    }
    drawer: {
      isOpen: boolean
    }
  }
}

const initialState: configState = {
  workspace: {
    navTree: {
      expanded: [],
      selected: ''
    },
    drawer: {
      isOpen: true
    }
  }
}

const configSlice = createSlice({
  name: 'config',
  initialState: initialState,
  reducers: {
    setExpanded: (state, action: PayloadAction<string[]>) => {
      state.workspace.navTree.expanded = action.payload
    },
    setSelected: (state, action: PayloadAction<string>) => {
      state.workspace.navTree.selected = action.payload
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.workspace.drawer.isOpen = action.payload
    }
  }
})

export const { setExpanded, setSelected, setDrawerOpen } = configSlice.actions

export const selectNavTreeExpanded = (state: RootState) => state.config.workspace.navTree.expanded
export const selectNavTreeSelected = (state: RootState) => state.config.workspace.navTree.selected
export const selectIsOpenDrawer = (state: RootState) => state.config.workspace.drawer.isOpen

export default configSlice.reducer
