import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { MemoryCollectionsRepo } from "./memoryRepo";
import { Collection } from "./collection";
import { RootState } from "../../app/store";



const repo = new MemoryCollectionsRepo()

export const collectionsSlice = createSlice({ 
    name: 'collections',
    initialState: {
        data: repo._data
    },
    reducers: {
        create: (state, action: PayloadAction<Collection>) => {
            repo.data(state.data).save(action.payload)
        },
        update: (state, action: PayloadAction<Collection>) => {
            repo.data(state.data).update(action.payload)
        },
        deleteById: (state, action: PayloadAction<number>) => {
            repo.data(state.data).deleteById(action.payload)
        }
    }
})

export const { create, update, deleteById } = collectionsSlice.actions

export const selectAllCollection = (state: RootState) => {
    return repo.data(state.collection.data).findAll()
}

export const selectCollectionById = (state: RootState, id: number) => {
    return repo.data(state.collection.data).findById(id)
  }

export default collectionsSlice.reducer
