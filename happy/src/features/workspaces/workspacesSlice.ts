import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { MemoryWorkspacesRepo } from './memoryRepo'
import { Workspace } from './workspace'

const repo = new MemoryWorkspacesRepo()

export const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState: {
    data: repo._data
  },
  reducers: {
    create: (state, action: PayloadAction<Workspace>) => {
      repo.data(state.data).save(action.payload)
    },
    update: (state, action: PayloadAction<Workspace>) => {
      repo.data(state.data).update(action.payload)
    },
    deleteById:  (state, action: PayloadAction<number>) => {
      repo.data(state.data).deleteById(action.payload)
    },
  }
})

export const { create, update, deleteById } = workspacesSlice.actions

export const selectAllWorkspace = (state: RootState) => {
  return repo.data(state.workspace.data).findAll()
}

export const selectWorkspaceById = (state: RootState, id: number) => {
  return repo.data(state.workspace.data).findById(id)
}

export default workspacesSlice.reducer
