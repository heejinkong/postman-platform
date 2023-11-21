import { createAsyncThunk } from '@reduxjs/toolkit'
import { workspaceCommands, workspaceItem } from '../domain/workspaceEntity'

class workspaceService implements workspaceCommands {
  new = createAsyncThunk('workspaceService/new', async (workspace: workspaceItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'workspaces/createWorkspace', payload: workspace })
  })

  delete = createAsyncThunk(
    'workspaceService/delete',
    async (workspace: workspaceItem, thunkAPI) => {
      workspace.collections.map((collectionId) => {
        thunkAPI.dispatch({ type: 'collections/deleteCollectionById', payload: collectionId })
      })

      thunkAPI.dispatch({ type: 'workspaces/deleteWorkspaceById', payload: workspace.id })
    }
  )

  update = createAsyncThunk(
    'workspaceService/update',
    async (workspace: workspaceItem, thunkAPI) => {
      workspace.updated = Date.now()
      thunkAPI.dispatch({ type: 'workspaces/updateWorkspace', payload: workspace })
    }
  )
}

export default new workspaceService()
