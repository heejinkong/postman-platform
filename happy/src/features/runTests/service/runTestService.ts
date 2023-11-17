/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { repositoryItem } from '../../../repository/repositoryItem'
import { runTestItem } from './runTestItem'
import { RootState } from '../../../app/store'

interface runTestDomain {
  new: unknown
  delete: unknown
}

class runTestService implements runTestDomain {
  new = createAsyncThunk('runTestService/new', async (runTest: runTestItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState


    thunkAPI.dispatch({ type: 'runTests/createRunTest', payload: runTest })

    thunkAPI.dispatch({ type: 'requests/send', payload: runTest.requestId })

    

  })

  delete = createAsyncThunk('runTestService/delete', async (_item: repositoryItem, _thunkAPI) => {
    // TODO : Implement
  })
}

export default new runTestService()
