import { createAsyncThunk } from '@reduxjs/toolkit'
import { requestItem } from '../requestItem'
import axios from 'axios'
export const sendRequest = createAsyncThunk('requests/send', async (arg: requestItem, thunkAPI) => {
  try {
    arg
    const response = await axios({
      url: arg.url,
      method: arg.method
    })
    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error)
  }
})
