import { createAsyncThunk } from '@reduxjs/toolkit';
import { globalsItem } from '../domain/globalsItem';
import { RootState } from '../../../app/store';
import { selectWorkspaceById } from '../../workspaces/service/workspaceSlice';

class globalsService {
  new = createAsyncThunk('globalsService/new', async (globals: globalsItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;

    thunkAPI.dispatch({ type: 'globals/createGlobals', payload: globals });

    const workspace = selectWorkspaceById(state, globals.workspaceId);
    const cloned = JSON.parse(JSON.stringify(workspace));
    cloned.globalsId.push(globals.id);

    thunkAPI.dispatch({ type: 'workspaces/updateWorkspace', payload: cloned });
  });

  update = createAsyncThunk('globalsService/update', async (globals: globalsItem, thunkAPI) => {
    thunkAPI.dispatch({ type: 'globals/updateGlobals', payload: globals });
  });

  delete = createAsyncThunk('globalsService/delete', async (globals: globalsItem, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;

    const workspace = selectWorkspaceById(state, globals.workspaceId);
    const cloned = JSON.parse(JSON.stringify(workspace));
    cloned.globalsId = cloned.globalsId.filter((id: string) => id !== globals.id);
    thunkAPI.dispatch({ type: 'workspaces/updateWorkspace', payload: cloned });

    thunkAPI.dispatch({ type: 'globals/deleteGlobalsById', payload: globals.id });
  });
}

export default new globalsService();
