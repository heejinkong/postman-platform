import { createAsyncThunk } from '@reduxjs/toolkit'
import { Item } from '../../../repository/Item'
import { RootState } from '../../../app/store'
import { selectFolderById } from '../../folders/service/folderSlice'
import { selectCollectionById } from '../../collections/service/collectionSlice'
import { selectNavTreeExpanded } from '../configSlice'
import { configCommands } from '../domain/configEntity'

class configService implements configCommands {
  navItemOpened = createAsyncThunk('configService/navItemOpened', async (item: Item, thunkAPI) => {
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

    const navTreeExpanded = expanded.concat(selectNavTreeExpanded(state))
    const navBarExpanded = expanded

    thunkAPI.dispatch({
      type: 'config/setNavBarExpanded',
      payload: navBarExpanded
    })
    thunkAPI.dispatch({
      type: 'config/setNavTreeExpanded',
      payload: navTreeExpanded
    })
    thunkAPI.dispatch({
      type: 'config/setNavTreeSelected',
      payload: item.id
    })

    return expanded
  })
}

export default new configService()
