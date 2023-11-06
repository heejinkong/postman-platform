
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../../app/store'
import { MemoryRequestsRepo } from './memoryRepo'
import { Request } from './request'


const repo = new MemoryRequestsRepo()

export const requestsSlice = createSlice({
  name: 'requests',
  initialState: {
    data: repo._data,
    requests : repo._data.Requests,
  },
  reducers: {
    create: (state, action: PayloadAction<Request>) => {
      repo.data(state.data).save(action.payload)
    },
    update: (state, action: PayloadAction<Request>) => {
      repo.data(state.data).update(action.payload)
    },
    deleteByRequestId:  (state, action: PayloadAction<number>) => {
      repo.data(state.data).deleteByRequestId(action.payload)
    },
    
  },
})

export const { create, update, deleteByRequestId } = requestsSlice.actions

export const selectAllRequest = (state: RootState) => {
  return repo.data(state.request.data).findAll()
}

export const selectRequesteById = (state: RootState, id: number) => {
  return repo.data(state.request.data).findById(id)
}

export default requestsSlice.reducer
