import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { memoryRepository } from '../../../repository/memoryRepository';
import { runTestItem } from '../domain/runTestItem';
import { RootState } from '../../../app/store';

const repo = new memoryRepository();

const runTestsSlice = createSlice({
  name: 'runTests',
  initialState: {
    data: repo._data,
  },
  reducers: {
    createRunTest: (state, action: PayloadAction<runTestItem>) => {
      repo.data(state.data).save(action.payload);
    },
    deleteRunTestById: (state, action: PayloadAction<string>) => {
      repo.data(state.data).deleteById(action.payload);
    },
  },
});

export const { createRunTest, deleteRunTestById } = runTestsSlice.actions;

export const selectAllRunTests = (state: RootState) => repo.data(state.runTests.data).findAll() as runTestItem[];
export const selectRunTestsById = (state: RootState, id: string) =>
  repo.data(state.workspaces.data).findById(id) as runTestItem;

export default runTestsSlice.reducer;
