import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { memoryRepository } from '../../../repository/memoryRepository'
import { globalsItem } from '../domain/globalsItem'
import { RootState } from '../../../app/store'

const repo = new memoryRepository()

const globalsSlice = createSlice({
  name: 'globals',
  initialState: {
    data: repo._data
  },
  reducers: {
    createGlobals: (state, action: PayloadAction<globalsItem>) => {
      repo.data(state.data).save(action.payload)
    },
    updateGlobals: (state, action: PayloadAction<globalsItem>) => {
      repo.data(state.data).save(action.payload)
    },

    deleteGlobalsById: (state, action: PayloadAction<string>) => {
      repo.data(state.data).deleteById(action.payload)
    }
  }
})

export const { createGlobals, updateGlobals, deleteGlobalsById } = globalsSlice.actions

export const selectAllGlobals = (state: RootState) =>
  repo.data(state.globals.data).findAll() as globalsItem[]

export const selectGlobalsById = (state: RootState, id: string) =>
  repo.data(state.globals.data).findById(id) as globalsItem

export default globalsSlice.reducer
