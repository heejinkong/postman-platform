import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { memoryRepository } from '../../../repository/memoryRepository'
import { environmentItem } from '../domain/environmentItem'
import { RootState } from '../../../app/store'

const repo = new memoryRepository()

const environmentSlice = createSlice({
  name: 'environments',
  initialState: {
    data: repo._data
  },
  reducers: {
    createEnvironment: (state, action: PayloadAction<environmentItem>) => {
      repo.data(state.data).save(action.payload)
    },
    updateEnvironment: (state, action: PayloadAction<environmentItem>) => {
      repo.data(state.data).save(action.payload)
    },

    deleteEnvironmentById: (state, action: PayloadAction<string>) => {
      repo.data(state.data).deleteById(action.payload)
    }
  }
})

export const { createEnvironment, updateEnvironment, deleteEnvironmentById } =
  environmentSlice.actions

export const selectAllEnvironments = (state: RootState) =>
  repo.data(state.environments.data).findAll() as environmentItem[]
export const selectEnvironmentById = (state: RootState, id: string) =>
  repo.data(state.environments.data).findById(id) as environmentItem

export default environmentSlice.reducer
