/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit'
import { repositoryItem } from '../../../repository/repositoryItem'
import { runResultItem } from '../runResultItem'
import { requestItem } from '../../requests/requestItem'
import axios from 'axios'

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

  runRequest = createAsyncThunk('runResultService/runResult', async (request: requestItem, thunkAPI) => {
    const start = Date.now()
    try {
      const params: { [key: string]: string } = {}
      request.paramsSelection.map((id) => {
        const item = request.params.find((item) => item.id === id)
        if (item) {
          params[item._key] = item._value
        }
      })

      const headers: { [key: string]: string } = {}
      request.headersSelection.map((id) => {
        const item = request.headers.find((item) => item.id === id)
        if (item) {
          headers[item._key] = item._value
        }
      })
      const response = await axios({
        method: request.method,
        url: request.url,
        headers: headers,
        params: params
      })
      const end = Date.now()
      const elapsed = end - start

      const newRequest = JSON.parse(JSON.stringify(request)) as requestItem
      newRequest.response.status = response.status
      newRequest.response.statusText = response.statusText
      newRequest.response.body = JSON.stringify(response.data, null, 2)
      newRequest.response.headers = []
      newRequest.response.elapsed = elapsed
      Object.keys(response.headers).map((key) => {
        newRequest.response.headers.push({
          id: newRequest.response.headers.length,
          _key: key,
          _value: response.headers[key],
          _desc: ''
        })
      })
      thunkAPI.dispatch({ type: 'requests/updateRequest', payload: newRequest })

      return response
    } catch (error) {
      const end = Date.now()
      const elapsed = end - start

      const newRequest = JSON.parse(JSON.stringify(request)) as requestItem
      newRequest.response.status = 0
      newRequest.response.statusText = ''
      newRequest.response.body = error?.toString() ?? ''
      newRequest.response.headers = []
      newRequest.response.elapsed = elapsed
      thunkAPI.dispatch({ type: 'requests/updateRequest', payload: newRequest })

      return thunkAPI.rejectWithValue(error)
    }

  })

  runFolder = createAsyncThunk(
    'runResultService/runFolder',
    async (folder: folderItem, thunkAPI) => {
      // TODO : Implement
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
