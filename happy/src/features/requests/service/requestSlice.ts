import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { memoryRepository } from '../../../repository/memoryRepository'
import { RootState } from '../../../app/store'
import { requestItem } from '../domain/requestEntity'

const repo = new memoryRepository()

const requestSlice = createSlice({
  name: 'requests',
  initialState: {
    data: repo._data
  },
  reducers: {
    createRequest: (state, action: PayloadAction<requestItem>) => {
      repo.data(state.data).save(action.payload)
    },
    updateRequest: (state, action: PayloadAction<requestItem>) => {
      repo.data(state.data).save(action.payload)
    },
    deleteRequestById: (state, action: PayloadAction<string>) => {
      repo.data(state.data).deleteById(action.payload)
    }
  }
})

export const { createRequest, updateRequest, deleteRequestById } = requestSlice.actions

export const selectAllRequests = (state: RootState) =>
  repo.data(state.requests.data).findAll() as requestItem[]
export const selectRequestById = (state: RootState, id: string) =>
  repo.data(state.requests.data).findById(id) as requestItem

export default requestSlice.reducer
