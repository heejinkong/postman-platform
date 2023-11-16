import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { memoryRepository } from '../../repository/memoryRepository'
import { RootState } from '../../app/store'
import { requestItem } from './requestItem'
import requestService from './service/requestService'

const repo = new memoryRepository()

const requestsSlice = createSlice({
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
    },
    runRequestById: (state, action: PayloadAction<string>) => {
      const request = repo.data(state.data).findById(action.payload) as requestItem
      requestService.send(request)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(requestService.send.rejected, (_state, action) => {
        console.log('request is rejected', action.error)
      })
      .addCase(requestService.send.fulfilled, (_state, action) => {
        console.log('request is successed', action.payload)
      })
  }
})

export const { createRequest, updateRequest, deleteRequestById } = requestsSlice.actions

export const selectAllRequests = (state: RootState) =>
  repo.data(state.requests.data).findAll() as requestItem[]
export const selectRequestById = (state: RootState, id: string) =>
  repo.data(state.requests.data).findById(id) as requestItem

export default requestsSlice.reducer
