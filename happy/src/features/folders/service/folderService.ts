import { createAsyncThunk } from '@reduxjs/toolkit'
import { folderCommands, folderItem } from '../domain/folderEntity'
import { RootState } from '../../../app/store'
import { selectCollectionById } from '../../collections/service/collectionSlice'
import { selectFolderById } from './folderSlice'

class folderService implements folderCommands {
  new = createAsyncThunk('folderService/new', async (folder: folderItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState

    thunkAPI.dispatch({ type: 'folders/createFolder', payload: folder })

    const parentCollection = selectCollectionById(state, folder.parentId)
    if (parentCollection) {
      const cloned = JSON.parse(JSON.stringify(parentCollection))
      cloned.folders.push(folder.id)
      thunkAPI.dispatch({ type: 'collections/updateCollection', payload: cloned })
    }

    const parentFolder = selectFolderById(state, folder.parentId)
    if (parentFolder) {
      const cloned = JSON.parse(JSON.stringify(parentFolder))
      cloned.folders.push(folder.id)
      thunkAPI.dispatch({ type: 'folders/updateFolder', payload: cloned })
    }
  })

  delete = createAsyncThunk('folderService/delete', async (folder: folderItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState

    const parentCollection = selectCollectionById(state, folder.parentId)
    if (parentCollection) {
      const cloned = JSON.parse(JSON.stringify(parentCollection))
      cloned.folders = cloned.folders.filter((id: string) => id !== folder.id)
      thunkAPI.dispatch({ type: 'collections/updateCollection', payload: cloned })
    }

    const parentFolder = selectFolderById(state, folder.parentId)
    if (parentFolder) {
      const cloned = JSON.parse(JSON.stringify(parentFolder))
      cloned.folders = cloned.folders.filter((id: string) => id !== folder.id)
      thunkAPI.dispatch({ type: 'folders/updateFolder', payload: cloned })
    }

    folder.folders.map((folderId) => {
      thunkAPI.dispatch({ type: 'folders/deleteFolderById', payload: folderId })
    })

    folder.requests.map((requestId) => {
      thunkAPI.dispatch({ type: 'requests/deleteRequestById', payload: requestId })
    })

    thunkAPI.dispatch({ type: 'folders/deleteFolderById', payload: folder.id })
  })

  update = createAsyncThunk('folderService/update', async (folder: folderItem, thunkAPI) => {
    folder.updated = Date.now()
    thunkAPI.dispatch({ type: 'folders/updateFolder', payload: folder })
  })
}

export default new folderService()
