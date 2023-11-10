import { createAsyncThunk } from "@reduxjs/toolkit"
import { workspaceItem } from "../workspaceItem"

export const newWorkspace = createAsyncThunk("workspaces/new", async (arg : workspaceItem , thunkAPI) => {
    thunkAPI.dispatch({ type: "workspaces/createWorkspace", payload: arg })
})
