import { createAsyncThunk } from '@reduxjs/toolkit'
import { folderItem } from '../folderItem'
import { collectionItem } from '../../collections/collectionItem'

export const deleteFolderInCollection = createAsyncThunk(
  'folders/delete',
  async (arg: { folder: folderItem; parent: collectionItem }, thunkAPI) => {
    thunkAPI.dispatch({ type: 'folders/deleteFolderById', payload: arg.folder.id })

    const cloned = JSON.parse(JSON.stringify(arg.parent))
    cloned.folders = cloned.folders.filter((id: string) => id !== arg.folder.id)
    cloned.updated = Date.now()
    thunkAPI.dispatch({ type: 'collections/updateCollection', payload: cloned })

    arg.folder.requests.map((requestId) => {
      thunkAPI.dispatch({ type: 'requests/deleteRequestById', payload: requestId })
    })
  }
)

export const deleteFolderInFolder = createAsyncThunk(
  'folders/delete',
  async (arg: { folder: folderItem; parent: folderItem }, thunkAPI) => {
    thunkAPI.dispatch({ type: 'folders/deleteFolderById', payload: arg.folder.id })

    const cloned = JSON.parse(JSON.stringify(arg.parent))
    cloned.folders = cloned.folders.filter((id: string) => id !== arg.folder.id)
    cloned.updated = Date.now()
    thunkAPI.dispatch({ type: 'folders/updateFolder', payload: cloned })

    arg.folder.requests.map((requestId) => {
      thunkAPI.dispatch({ type: 'requests/deleteRequestById', payload: requestId })
    })
    arg.folder.folders.map((folderId) => {
      thunkAPI.dispatch({ type: 'folders/deleteFolderById', payload: folderId })
    })
  }
)
