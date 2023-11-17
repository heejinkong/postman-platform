/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { repositoryItem } from '../../../repository/repositoryItem'
import { runResultItem } from './runResultItem'
import { RootState } from '../../../app/store'
import { selectCollectionById } from '../../collections/collectionsSlice'

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
