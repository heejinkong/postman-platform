/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { repositoryItem } from '../../../repository/repositoryItem'
import { runTestItem } from './runTestItem'
import { RootState } from '../../../app/store'
import { selectAllRunResult } from '../../runResults/service/runResultSlice'
import { selectRunResultById } from './runTestSlice'
import { runResultItem } from '../../runResults/service/runResultItem'

interface runTestDomain {
  new: unknown
  delete: unknown
}

class runTestService implements runTestDomain {
  new = createAsyncThunk('runTestService/new', async (runTest: runTestItem, thunkAPI) => {
    const state: RootState = thunkAPI.getState() as RootState

    thunkAPI.dispatch({ type: 'runTests/createRunTest', payload: runTest })

    thunkAPI.dispatch({ type: 'requests/send', payload: runTest.requestId })
  })

  delete = createAsyncThunk('runTestService/delete', async (_item: repositoryItem, _thunkAPI) => {
    // TODO : Implement
  })
}

export default new runTestService()
