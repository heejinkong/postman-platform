/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { repositoryItem } from '../../../repository/repositoryItem'
import { runResultItem } from './runResultItem'
import { RootState } from '../../../app/store'
import { selectCollectionById } from '../../collections/collectionsSlice'
import { selectAllRunResult } from './runResultSlice'
import { selectAllRunResults } from '../../runTests/service/runTestSlice'
import { runTestItem } from '../../runTests/service/runTestItem'

interface runResultDomain {
  new: unknown
  delete: unknown
  runAgain: unknown
  setStage: unknown
}

class runResultService implements runResultDomain {
  new = createAsyncThunk('runResultService/new', async (runResult: runResultItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState

    thunkAPI.dispatch({ type: 'runResults/createRunResult', payload: runResult })
    thunkAPI.dispatch({ type: 'runResults/updateRunResult', payload: runResult })
  })

  delete = createAsyncThunk('runResultService/delete', async (_item: repositoryItem, _thunkAPI) => {
    // TODO : Implement
  })

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
