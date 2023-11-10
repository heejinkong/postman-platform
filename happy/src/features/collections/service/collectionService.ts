import { createAsyncThunk } from "@reduxjs/toolkit"
import { workspaceItem } from "../../workspaces/workspaceItem"
import { collectionItem } from "../collectionItem"

export const deleteCollection = createAsyncThunk("collections/delete", async (arg : { collection: collectionItem, parent: workspaceItem } , thunkAPI) => {
    thunkAPI.dispatch({ type: "collections/deleteCollectionById", payload: arg.collection.id })

    const cloned = JSON.parse(JSON.stringify(arg.parent))
    cloned.collections = cloned.collections.filter((id: string) => id !== arg.collection.id)
    cloned.updated = Date.now()
    thunkAPI.dispatch({ type: "workspaces/updateWorkspace", payload: cloned })

    arg.collection.folders.map((folderId) => {
        thunkAPI.dispatch({ type: "folders/deleteFolderById", payload: folderId })
    })

    arg.collection.requests.map((requestId) => {
        thunkAPI.dispatch({ type: "requests/deleteRequestById", payload: requestId })
    })
})
