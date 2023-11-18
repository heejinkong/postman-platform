/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { runTestItem } from '../runTestItem'

interface runTestDomain {
  new: unknown
  delete: unknown
}

class runTestService implements runTestDomain {
  new = createAsyncThunk('runTestService/new', async (runTest: runTestItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'runTests/createRunTest', payload: runTest })

    thunkAPI.dispatch({ type: 'requests/send', payload: runTest.requestId })
  })

  delete = createAsyncThunk('runTestService/delete', async (runTest: runTestItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'runTests/deleteRunTestById', payload: runTest.id })
  })
}

export default new runTestService()
