import { createAsyncThunk } from '@reduxjs/toolkit'
import { requestCommands, requestItem } from '../domain/requestEntity'
import { RootState } from '../../../app/store'
import { selectCollectionById } from '../../collections/service/collectionSlice'
import { selectFolderById } from '../../folders/service/folderSlice'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'


class requestService implements requestCommands {
  new = createAsyncThunk('requestService/new', async (request: requestItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState

    thunkAPI.dispatch({ type: 'requests/createRequest', payload: request })

    const parentCollection = selectCollectionById(state, request.parentId)
    if (parentCollection) {
      const cloned = JSON.parse(JSON.stringify(parentCollection))
      cloned.requests.push(request.id)
      thunkAPI.dispatch({ type: 'collections/updateCollection', payload: cloned })
    }

    const parentFolder = selectFolderById(state, request.parentId)
    if (parentFolder) {
      const cloned = JSON.parse(JSON.stringify(parentFolder))
      cloned.requests.push(request.id)
      thunkAPI.dispatch({ type: 'folders/updateFolder', payload: cloned })
    }
  })

  delete = createAsyncThunk('requestService/delete', async (request: requestItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState

    const parentCollection = selectCollectionById(state, request.parentId)
    if (parentCollection) {
      const cloned = JSON.parse(JSON.stringify(parentCollection))
      cloned.requests = cloned.requests.filter((id: string) => id !== request.id)
      thunkAPI.dispatch({ type: 'collections/updateCollection', payload: cloned })
    }

    const parentFolder = selectFolderById(state, request.parentId)
    if (parentFolder) {
      const cloned = JSON.parse(JSON.stringify(parentFolder))
      cloned.requests = cloned.requests.filter((id: string) => id !== request.id)
      thunkAPI.dispatch({ type: 'folders/updateFolder', payload: cloned })
    }

    thunkAPI.dispatch({ type: 'requests/deleteRequestById', payload: request.id })
  })

  update = createAsyncThunk('requestService/update', async (request: requestItem, thunkAPI) => {
    request.updated = Date.now()
    thunkAPI.dispatch({ type: 'requests/updateRequest', payload: request })
  })

  send = createAsyncThunk('requestService/send', async (request: requestItem, thunkAPI) => {
    const start = Date.now()
    try {
      const params: { [key: string]: string } = {};
request.paramsSelection.map((id) => {
  const item = request.params.find((item) => item.id === id);
  if (item) {
    params[item._key] = item._value;
  }
});

const headers: { [key: string]: string } = {};
request.headersSelection.map((id) => {
  const item = request.headers.find((item) => item.id === id);
  if (item) {
    headers[item._key] = item._value;
  }
});

const body = new FormData();

request.body.formDataSelection.forEach((id) => {
  const item = request.body.formData.find((item) => item.id === id);

  if (item) {
    if (item._dataType === 'File') {
    const formData = new FormData();
    for (let i = 0; i < item._value.length; i++) {
      formData.append(item._key, item._value[i]);
    }
    } else {
      body.append(item._key, item._value.join(','));
    }
  }
});

const axiosConfig = {
  method: request.method,
  url: request.url,
  headers: headers,
  params: params,
  data: body,
};

if (request.method.toLowerCase() === 'post') {
  axiosConfig.headers['Content-Type'] = 'multipart/form-data';
}

const response = await axios(axiosConfig);
    
  console.log(response.config)
      
      const end = Date.now()
      const elapsed = end - start

      console.log(response)
      
      const newRequest = JSON.parse(JSON.stringify(request)) as requestItem
      newRequest.response.status = response.status
      newRequest.response.statusText = response.statusText
      newRequest.response.body = JSON.stringify(response.data, null, 2)
      newRequest.response.headers = []
      newRequest.response.elapsed = elapsed
      Object.keys(response.headers).map((key) => {
        newRequest.response.headers.push({
          id: uuidv4(),
          _key: key,
          _value: response.headers[key],
          _desc: ''
        })
      })
      thunkAPI.dispatch({ type: 'requests/updateRequest', payload: newRequest })
      // const resUrl = response.config.url
      // const resMethod = response.config.method
      // const resDuration =  elapsed
      // const resBody = JSON.stringify(response.data, null, 2)
      // const resStatus = response.status
      // const resExpectedResult = request.expectedResult
  
      // const newRunResult = new runResultItem()
      // newRunResult.workspaceId =  request.workspaceId
      // newRunResult.parentId = request.parentId
      // newRunResult.method = resMethod || ''
      // newRunResult.url = resUrl || ''
      // newRunResult.created = Date.now()
      // newRunResult.Duration = resDuration ?? 0
     
     
      // const newRunTest = new runTestItem()
      // newRunTest.title = request.title || ''
      // newRunTest.parentId = request.parentId
      // newRunTest.requestId = request.id
      // newRunTest.created = Date.now()
      // newRunTest.status = resStatus || 0
      // newRunTest.responseResult = resBody || ''
      // newRunTest.expectedResult = resExpectedResult || ''
  
      // thunkAPI.dispatch({type: 'runTest/createRunTest', payload: newRunTest})
  
      // newRunResult.runTestList?.push(newRunTest.id)
      // thunkAPI.dispatch({ type: 'runResult/createRunResult', payload: newRunResult })
  
      return newRequest

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
}

export default new requestService()
