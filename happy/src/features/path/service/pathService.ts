import { createAsyncThunk } from "@reduxjs/toolkit";
import { Item } from '../../../repository/Item'
import { RootState } from "../../../app/store";
import { selectFolderById } from "../../folders/service/folderSlice";
import { selectCollectionById } from "../../collections/service/collectionSlice";
import { pathCommands } from "../domain/pathEntity";
import { selectPathExpanded } from "../pathSlice";


class pathService implements pathCommands {
    pathItemOpened = createAsyncThunk('pathService/pathItemOpened', async (item: Item, thunkAPI) => {
       
            const state = thunkAPI.getState() as RootState
        
            let depth = 0
            const expanded: string[] = [item.id]
            let parentId = item.parentId
            do {
              const folderParent = selectFolderById(state, parentId)
              if (folderParent) {
                expanded.push(folderParent.id)
                parentId = folderParent.parentId
                continue
              }
        
              const collectionParent = selectCollectionById(state, parentId)
              if (collectionParent) {
                expanded.push(collectionParent.id)
                parentId = collectionParent.parentId
                continue
              }
        
              break
            } while (depth++ < 100)

            const pathExpanded = expanded.concat(selectPathExpanded(state))
            const pathSelected = expanded

            thunkAPI.dispatch({
                type: 'path/setPathExpanded',
                payload: pathExpanded
            })
            thunkAPI.dispatch({
                type: 'path/setPathSelected',
                payload: pathSelected
            })
            thunkAPI.dispatch({
                type: 'path/setPathSelected',
                payload: item.id
            })

            return expanded    
        })
    
}
export default new pathService()