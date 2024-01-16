import { createAsyncThunk } from '@reduxjs/toolkit'
import { environmentItem } from '../domain/environmentItem'
import { RootState } from '../../../app/store'
import { selectRequestById } from '../../requests/service/requestSlice'

class environmentService {
  new = createAsyncThunk(
    'environmentService/new',
    async (environment: environmentItem, thunkAPI) => {
      const state = thunkAPI.getState() as RootState

      thunkAPI.dispatch({ type: 'environments/createEnvironment', payload: environment })

      const request = selectRequestById(state, environment.parentId)
      const cloned = JSON.parse(JSON.stringify(request))
      cloned.environmentId.push(environment.id)

      thunkAPI.dispatch({ type: 'requests/updateRequest', payload: cloned })
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
