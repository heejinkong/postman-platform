import { createAsyncThunk } from '@reduxjs/toolkit';
import { runTestItem } from '../domain/runTestItem';

class runTestService {
  new = createAsyncThunk('runTestService/new', async (runTest: runTestItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'runTests/createRunTest', payload: runTest });
  });

  delete = createAsyncThunk('runTestService/delete', async (runTest: runTestItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'runTests/deleteRunTestById', payload: runTest.id });
  });
}

export default new runTestService();
