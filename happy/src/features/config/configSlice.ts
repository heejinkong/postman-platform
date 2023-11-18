import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

type configState = {
  workspace: {
    navTree: {
      expanded: string[]
      selected: string
    }
    navBar: {
      expanded: string[]
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
    navBar: {
      expanded: []
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
    setNavTreeExpanded: (state, action: PayloadAction<string[]>) => {
      state.workspace.navTree.expanded = action.payload
    },
    setNavTreeSelected: (state, action: PayloadAction<string>) => {
      state.workspace.navTree.selected = action.payload
    },
    setNavBarExpanded: (state, action: PayloadAction<string[]>) => {
      state.workspace.navBar.expanded = action.payload
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.workspace.drawer.isOpen = action.payload
    }
  }
})

export const configAction = configSlice.actions

export const selectNavTreeExpanded = (state: RootState) => state.config.workspace.navTree.expanded
export const selectNavTreeSelected = (state: RootState) => state.config.workspace.navTree.selected
export const selectNavBarExpanded = (state: RootState) => state.config.workspace.navBar.expanded
export const selectIsOpenDrawer = (state: RootState) => state.config.workspace.drawer.isOpen

export default configSlice.reducer