import { createAsyncThunk } from '@reduxjs/toolkit'
import { collectionCommands, collectionItem } from '../domain/collectionEntity'
import { RootState } from '../../../app/store'
import { selectWorkspaceById } from '../../workspaces/service/workspaceSlice'

class collectionService implements collectionCommands {
  new = createAsyncThunk('collectionService/new', async (collection: collectionItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'collections/createCollection', payload: collection })

    const state = thunkAPI.getState() as RootState
    const workspace = selectWorkspaceById(state, collection.workspaceId)
    const cloned = JSON.parse(JSON.stringify(workspace))
    cloned.collections.push(collection.id)
    thunkAPI.dispatch({ type: 'workspaces/updateWorkspace', payload: cloned })
  })

  delete = createAsyncThunk(
    'collectionService/delete',
    async (collection: collectionItem, thunkAPI) => {
      const state = thunkAPI.getState() as RootState
      const workspace = selectWorkspaceById(state, collection.workspaceId)
      const cloned = JSON.parse(JSON.stringify(workspace))
      cloned.collections = cloned.collections.filter((id: string) => id !== collection.id)
      thunkAPI.dispatch({ type: 'workspaces/updateWorkspace', payload: cloned })

      collection.folders.map((folderId) => {
        thunkAPI.dispatch({ type: 'folders/deleteFolderById', payload: folderId })
      })

      collection.requests.map((requestId) => {
        thunkAPI.dispatch({ type: 'requests/deleteRequestById', payload: requestId })
      })

      thunkAPI.dispatch({ type: 'collections/deleteCollectionById', payload: collection.id })
    }
  )

  update = createAsyncThunk(
    'collectionService/update',
    async (collection: collectionItem, thunkAPI) => {
      collection.updated = Date.now()
      thunkAPI.dispatch({ type: 'collections/updateCollection', payload: collection })
    }
  )
}

export default new collectionService()
