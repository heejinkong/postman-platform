import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { memoryRepository } from '../../../repository/memoryRepository'
import { workspaceItem } from '../domain/workspaceItem'
import { RootState } from '../../../app/store'

const repo = new memoryRepository()

const workspaceSlice = createSlice({
  name: 'workspaces',
  initialState: {
    data: repo._data
  },
  reducers: {
    createWorkspace: (state, action: PayloadAction<workspaceItem>) => {
      repo.data(state.data).save(action.payload)
    },
    updateWorkspace: (state, action: PayloadAction<workspaceItem>) => {
      repo.data(state.data).save(action.payload)
    },
    deleteWorkspaceById: (state, action: PayloadAction<string>) => {
      repo.data(state.data).deleteById(action.payload)
    }
  }
})

export const { createWorkspace, updateWorkspace, deleteWorkspaceById } = workspaceSlice.actions

export const selectAllWorkspaces = (state: RootState) =>
  repo.data(state.workspaces.data).findAll() as workspaceItem[]
export const selectWorkspaceById = (state: RootState, id: string) =>
  repo.data(state.workspaces.data).findById(id) as workspaceItem

export default workspaceSlice.reducer
