import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { memoryRepository } from '../../../repository/memoryRepository'
import { runResultItem } from './runResultItem'
import { RootState } from '../../../app/store'

const repo = new memoryRepository()

const runResultSlice = createSlice({
  name: 'runResult',
  initialState: {
    data: repo._data
  },
  reducers: {
    createRunResult: (state, action: PayloadAction<runResultItem>) => {
      repo.data(state.data).save(action.payload)
    },
    deleteRunResult: (state, action: PayloadAction<string>) => {
      repo.data(state.data).deleteById(action.payload)
    }
  }
})

export const {createRunResult} = runResultSlice.actions

export const selectAllRunResult = (state: RootState) =>
  repo.data(state.runResults.data).findAll() as runResultItem[]
export const selectRunResultById = (state: RootState, id: string) =>
  repo.data(state.runResults.data).findById(id) as runResultItem

export default runResultSlice.reducer
