import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { memoryRepository } from '../../../repository/memoryRepository'
import { RootState } from '../../../app/store'
import { collectionItem } from '../domain/collectionEntity'

const repo = new memoryRepository()

const collectionsSlice = createSlice({
  name: 'collections',
  initialState: {
    data: repo._data
  },
  reducers: {
    createCollection: (state, action: PayloadAction<collectionItem>) => {
      repo.data(state.data).save(action.payload)
    },
    updateCollection: (state, action: PayloadAction<collectionItem>) => {
      repo.data(state.data).save(action.payload)
    },
    deleteCollectionById: (state, action: PayloadAction<string>) => {
      repo.data(state.data).deleteById(action.payload)
    }
  }
})

export const { createCollection, updateCollection, deleteCollectionById } = collectionsSlice.actions

export const selectAllCollections = (state: RootState) =>
  repo.data(state.collections.data).findAll() as collectionItem[]
export const selectCollectionById = (state: RootState, id: string) =>
  repo.data(state.collections.data).findById(id) as collectionItem

export default collectionsSlice.reducer
