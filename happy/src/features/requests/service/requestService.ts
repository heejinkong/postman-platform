import { createAsyncThunk } from '@reduxjs/toolkit'
import { requestItem } from '../domain/requestItem'
import { RootState } from '../../../app/store'
import { selectCollectionById } from '../../collections/service/collectionSlice'
import { selectFolderById } from '../../folders/service/folderSlice'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { selectAllGlobals } from '../../globalsVariable/service/globalsSlice'

type FormFileType = {
  id: string
  file: File
}

class requestService {
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

  send = createAsyncThunk(
    'requestService/send',
    async (
      requestData: {
        request: requestItem
        formFiles: FormFileType[] | null
      },
      thunkAPI
    ) => {
      const request = requestData.request

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

        const body = new FormData()

        request.body.formDataSelection.forEach((id) => {
          const item = request.body.formData.find((i) => i.id === id)

          if (item) {
            if (item._dataType === 'File') {
              const file = requestData.formFiles?.find((f) => f.id === item.id)
              body.append(item._key, file?.file ?? '')
            } else {
              body.append(item._key, item._value.join(','))
            }
          }
        })

        const workspaceId = request.workspaceId
        const state = thunkAPI.getState() as RootState
        const globals = selectAllGlobals(state)
        const global = globals.find((item) => item.workspaceId === workspaceId)

        console.log(global)

        const variablesSelection = global?.variablesSelection
        const variables =
          global?.variables.filter((variable) => variablesSelection?.includes(variable.id)) || []

        const regex = /{{(.*?)}}/g
        const match = request.url.match(regex)
        let modifiedUrl = request.url // Store the modified URL

        if (match) {
          match.forEach((m) => {
            const variable = m.replace('{{', '').replace('}}', '')
            const item = variables.find((i) => i._variable === variable)
            if (item) {
              modifiedUrl = modifiedUrl.replace(m, item._initialValue)
            }
          })
        }

        console.log(modifiedUrl)

        const axiosConfig = {
          method: request.method,
          url: modifiedUrl, // Use the modified URL for the request
          headers: headers,
          params: params,
          data: body
        }

        if (request.method.toLowerCase() === 'post') {
          axiosConfig.headers['Content-Type'] = 'multipart/form-data'
        }

        const response = await axios(axiosConfig)

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
            id: uuidv4(),
            _key: key,
            _value: response.headers[key],
            _desc: ''
          })
        })
        thunkAPI.dispatch({ type: 'requests/updateRequest', payload: newRequest })

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
    }
  )
}

export default new requestService()
