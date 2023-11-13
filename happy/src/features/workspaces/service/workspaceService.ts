import { createAsyncThunk } from '@reduxjs/toolkit'
import { workspaceItem } from '../workspaceItem'

export const newWorkspace = createAsyncThunk(
  'workspaces/new',
  async (arg: workspaceItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'workspaces/createWorkspace', payload: arg })
  }
)

export const deleteWorkspace = createAsyncThunk(
  'workspaces/delete',
  async (arg: workspaceItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'workspaces/deleteWorkspaceById', payload: arg.id })

    //arg의 collection들을 삭제
    arg.collections.map((collectionId) => {
      thunkAPI.dispatch({ type: 'collections/deleteCollectionById', payload: collectionId })
    })
  }
)
