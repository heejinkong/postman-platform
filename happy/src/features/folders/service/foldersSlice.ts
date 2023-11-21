import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { memoryRepository } from '../../../repository/memoryRepository'
import { RootState } from '../../../app/store'
import { folderItem } from '../domain/folderEntity'

const repo = new memoryRepository()

const foldersSlice = createSlice({
  name: 'folders',
  initialState: {
    data: repo._data
  },
  reducers: {
    createFolder: (state, action: PayloadAction<folderItem>) => {
      repo.data(state.data).save(action.payload)
    },
    updateFolder: (state, action: PayloadAction<folderItem>) => {
      repo.data(state.data).save(action.payload)
    },
    deleteFolderById: (state, action: PayloadAction<string>) => {
      repo.data(state.data).deleteById(action.payload)
    }
  }
})

export const { createFolder, updateFolder, deleteFolderById } = foldersSlice.actions

export const selectAllFolders = (state: RootState) =>
  repo.data(state.folders.data).findAll() as folderItem[]
export const selectFolderById = (state: RootState, id: string) =>
  repo.data(state.folders.data).findById(id) as folderItem

export default foldersSlice.reducer
