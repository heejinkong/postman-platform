/* eslint-disable @typescript-eslint/no-unused-vars */
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Item } from '../../../repository/Item';
import { runResultItem } from '../domain/runResultItem';
import { requestItem } from '../../requests/domain/requestItem';
import axios from 'axios';
import { folderItem } from '../../folders/domain/folderItem';
import { v4 as uuidv4 } from 'uuid';
import { runTestItem } from '../../runTests/domain/runTestItem';

class runResultService {
  new = createAsyncThunk('runResultService/new', async (runResult: runResultItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'runResults/createRunResult', payload: runResult });
  });

  delete = createAsyncThunk('runResultService/delete', async (runResult: runResultItem, thunkAPI) => {
    runResult.runTestList.map((runTestId) => {
      thunkAPI.dispatch({ type: 'runTests/deleteRunTestById', payload: runTestId });
    });
    thunkAPI.dispatch({ type: 'runResults/deleteRunResultById', payload: runResult.id });
  });

  runRequest = createAsyncThunk('runResultService/runResult', async (request: requestItem, thunkAPI) => {
    const start = Date.now();
    try {
      const headers: { [key: string]: string } = {};
      request.headersSelection.map((id) => {
        const item = request.headers.find((item) => item.id === id);
        if (item) {
          headers[item._key] = item._value;
        }
      });
      const response = await axios({
        method: request.method,
        url: request.url,
        headers: headers,
      });
      const end = Date.now();
      const elapsed = end - start;

      const newRequest = JSON.parse(JSON.stringify(request)) as requestItem;
      newRequest.response.status = response.status;
      newRequest.response.statusText = response.statusText;
      newRequest.response.body = JSON.stringify(response.data, null, 2);
      newRequest.response.headers = [];
      newRequest.response.elapsed = elapsed;
      Object.keys(response.headers).map((key) => {
        newRequest.response.headers.push({
          id: uuidv4(),
          _key: key,
          _value: response.headers[key],
          _desc: '',
        });
      });
      const resUrl = response.config.url;
      const resMethod = response.config.method;
      const resDuration = elapsed;
      const resBody = JSON.stringify(response.data, null, 2);
      const resStatus = response.status;
      const resExpectedResult = request.expectedResult;

      const newRunResult = new runResultItem();
      newRunResult.workspaceId = request.workspaceId;
      newRunResult.parentId = request.parentId;
      newRunResult.method = resMethod || '';
      newRunResult.url = resUrl || '';
      newRunResult.created = Date.now();
      newRunResult.Duration = resDuration ?? 0;

      const newRunTest = new runTestItem();
      newRunTest.title = request.title || '';
      newRunTest.parentId = request.parentId;
      newRunTest.requestId = request.id;
      newRunTest.created = Date.now();
      newRunTest.status = resStatus || 0;
      newRunTest.responseResult = resBody || '';
      newRunTest.expectedResult = resExpectedResult || '';

      thunkAPI.dispatch({ type: 'runTest/createRunTest', payload: newRunTest });

      newRunResult.runTestList?.push(newRunTest.id);

      // const resultInRunTest = useAppSelector(allRunTests => allRunTests.runTests.data.find((runTest) => runTest.id === newRunTest.id))

      // if(resultInRunTest?.status === 0){
      //   newRunResult.runResult = 0
      // }
      // else{
      //   newRunResult.runResult = 1
      // }

      thunkAPI.dispatch({ type: 'runResult/newRunResult', payload: newRunResult });

      return newRequest;
    } catch (error) {
      const end = Date.now();
      const elapsed = end - start;

      const newRequest = JSON.parse(JSON.stringify(request)) as requestItem;
      newRequest.response.status = 0;
      newRequest.response.statusText = '';
      newRequest.response.body = error?.toString() ?? '';
      newRequest.response.headers = [];
      newRequest.response.elapsed = elapsed;
      thunkAPI.dispatch({ type: 'requests/updateRequest', payload: newRequest });

      return thunkAPI.rejectWithValue(error);
    }
  });

  runFolder = createAsyncThunk('runResultService/runFolder', async (_folder: folderItem, _thunkAPI) => {
    // TODO : Implement
  });

  runAgain = createAsyncThunk('runResultService/runAgain', async (_item: Item, _thunkAPI) => {
    // TODO : Implement
  });

  setStage = createAsyncThunk('runResultService/setStage', async (_item: Item, _thunkAPI) => {
    // TODO : Implement
  });
}

export default new runResultService();
