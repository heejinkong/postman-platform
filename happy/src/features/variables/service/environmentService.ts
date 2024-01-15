import { createAsyncThunk } from '@reduxjs/toolkit'
import { environmentCommands, environmentItem } from '../domain/environmentEntity'

class environmentService implements environmentCommands {
  edit: unknown
  save: unknown
  new = createAsyncThunk(
    'environmentService/new',
    async (environment: environmentItem, thunkAPI) => {
      thunkAPI.dispatch({ type: 'environments/createEnvironment', payload: environment })
    }
  )

  update = createAsyncThunk(
    'environmentService/update',
    async (environment: environmentItem, thunkAPI) => {
      thunkAPI.dispatch({ type: 'environments/updateEnvironment', payload: environment })
    }
  )

  delete = createAsyncThunk(
    'environmentService/delete',
    async (environment: environmentItem, thunkAPI) => {
      thunkAPI.dispatch({ type: 'environments/deleteEnvironmentById', payload: environment.id })
    }
  )
}
export default new environmentService()
