/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { repositoryItem } from '../../../repository/repositoryItem'
import { runResultItem } from '../runResultItem'

interface runResultDomain {
  new: unknown
  delete: unknown
  runAgain: unknown
  setStage: unknown
}

class runResultService implements runResultDomain {
  new = createAsyncThunk('runResultService/new', async (runResult: runResultItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'runResults/createRunResult', payload: runResult })
  })

  delete = createAsyncThunk(
    'runResultService/delete',
    async (runResult: runResultItem, thunkAPI) => {
      runResult.runTestList.map((runTestId) => {
        thunkAPI.dispatch({ type: 'runTests/deleteRunTestById', payload: runTestId })
      })
      thunkAPI.dispatch({ type: 'runResults/deleteRunResultById', payload: runResult.id })
    }
  )

  runAgain = createAsyncThunk(
    'runResultService/runAgain',
    async (_item: repositoryItem, _thunkAPI) => {
      // TODO : Implement
    }
  )

  setStage = createAsyncThunk(
    'runResultService/setStage',
    async (_item: repositoryItem, _thunkAPI) => {
      // TODO : Implement
    }
  )
}

export default new runResultService()
