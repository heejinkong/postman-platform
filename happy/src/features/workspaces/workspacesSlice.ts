import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { MemoryWorkspacesRepo } from './memoryRepo'
import { Workspace } from './workspace'
import { Collection } from '../collections/collection'

const repo = new MemoryWorkspacesRepo()

export const workspacesSlice = createSlice({
  name: 'workspaces',
  initialState: {
    data: repo._data,
    workspaces : repo._data.Workspaces,
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
    addCollectionToWorkspace: (state, action: PayloadAction<{ collection: Collection, parent_id: number }>) => {
      const parent_id = action.payload.parent_id;
      const workspace = repo.data(state.data).findById(parent_id);

      if (workspace) {
        workspace.collections.push(action.payload.collection as never);
      }
    },
  },
})

export const { create, update, deleteById, addCollectionToWorkspace } = workspacesSlice.actions

export const selectAllWorkspace = (state: RootState) => {
  return repo.data(state.workspace.data).findAll()
}

export const selectWorkspaceById = (state: RootState, id: number) => {
  return repo.data(state.workspace.data).findById(id)
}

export default workspacesSlice.reducer
