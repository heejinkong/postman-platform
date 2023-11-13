import { createAsyncThunk } from '@reduxjs/toolkit'
import { requestItem } from '../requestItem'
import { RootState } from '../../../app/store'
import { selectCollectionById } from '../../collections/collectionsSlice'
import axios from 'axios'
import { selectFolderById } from '../../folders/foldersSlice'

interface requestDomain {
  new: unknown
  delete: unknown
  update: unknown
  send: unknown
}

class requestService implements requestDomain {
  new = createAsyncThunk('requestService/new', async (request: requestItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState

    thunkAPI.dispatch({ type: 'requests/createRequest', payload: request })

    const parentCollection = selectCollectionById(state, request.parentId)
    if (parentCollection) {
      const cloned = JSON.parse(JSON.stringify(parentCollection))
      cloned.requests.push(request.id)
      thunkAPI.dispatch({ type: 'collections/updateCollection', payload: cloned })
    }

    const parentFolder = selectFolderById(state, request.parentId)
    if (parentFolder) {
      const cloned = JSON.parse(JSON.stringify(parentFolder))
      cloned.requests.push(request.id)
      thunkAPI.dispatch({ type: 'folders/updateFolder', payload: cloned })
    }
  })

  delete = createAsyncThunk('requestService/delete', async (request: requestItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState

    const parentCollection = selectCollectionById(state, request.parentId)
    if (parentCollection) {
      const cloned = JSON.parse(JSON.stringify(parentCollection))
      cloned.folders = cloned.folders.filter((id: string) => id !== request.id)
      thunkAPI.dispatch({ type: 'collections/updateCollection', payload: cloned })
    }

    const parentFolder = selectFolderById(state, request.parentId)
    if (parentFolder) {
      const cloned = JSON.parse(JSON.stringify(parentFolder))
      cloned.folders = cloned.folders.filter((id: string) => id !== request.id)
      thunkAPI.dispatch({ type: 'folders/updateFolder', payload: cloned })
    }

    thunkAPI.dispatch({ type: 'requests/deleteRequestById', payload: request.id })
  })

  update = createAsyncThunk('requestService/update', async (request: requestItem, thunkAPI) => {
    request.updated = Date.now()
    thunkAPI.dispatch({ type: 'requests/updateRequest', payload: request })
  })

  send = createAsyncThunk('requestService/update', async (request: requestItem, thunkAPI) => {
    try {
      const response = await axios({
        url: request.url,
        method: request.method,
        params: request.params,
        // params, header, body, user options, etc...
      })
      return thunkAPI.fulfillWithValue(response)
    } catch (error) {
      return thunkAPI.rejectWithValue(error)
    }
  })
}

export default new requestService()
