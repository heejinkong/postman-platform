import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { MemoryCollectionsRepo } from './memoryRepo'
import { Collection } from './collection'
import { RootState } from '../../app/store'

const repo = new MemoryCollectionsRepo()

export const collectionsSlice = createSlice({
  name: 'collections',
  initialState: {
    data: repo._data,
    collections: repo._data.Collections
  },
  reducers: {
    create: (state, action: PayloadAction<Collection>) => {
      repo.data(state.data).save(action.payload)
    },
    update: (state, action: PayloadAction<Collection>) => {
      repo.data(state.data).update(action.payload)
    },
    deleteByCollectionId: (state, action: PayloadAction<number>) => {
      repo.data(state.data).deleteByCollectionId(action.payload)
    },
    addRequestToCollection: (
      state,
      action: PayloadAction<{ request: Request; parent_id: number }>
    ) => {
      const parent_id = action.payload.parent_id
      const collection = repo.data(state.data).findById(parent_id)

      if (collection) {
        collection.requests.push(action.payload.request as never)
      }
    }
  }
})

export const { create, update, deleteByCollectionId, addRequestToCollection } = collectionsSlice.actions

export const selectAllCollection = (state: RootState) => {
  return repo.data(state.collection.data).findAll()
}

export const selectCollectionById = (state: RootState, id: number) => {
  return repo.data(state.collection.data).findById(id)
}

export default collectionsSlice.reducer
