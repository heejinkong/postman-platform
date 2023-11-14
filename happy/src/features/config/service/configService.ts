import { createAsyncThunk } from '@reduxjs/toolkit'
import { repositoryItem } from '../../../repository/repositoryItem'
import { RootState } from '../../../app/store'
import { selectFolderById } from '../../folders/foldersSlice'
import { selectCollectionById } from '../../collections/collectionsSlice'
import { selectNavTreeExpanded } from '../configSlice'

interface configDomain {
  navItemOpened: unknown
}

class configService implements configDomain {
  navItemOpened = createAsyncThunk(
    'configService/navItemOpened',
    async (item: repositoryItem, thunkAPI) => {
      const state = thunkAPI.getState() as RootState

      let depth = 0
      let expanded: string[] = []
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

      expanded = expanded.concat(selectNavTreeExpanded(state))

      thunkAPI.dispatch({
        type: 'config/setExpanded',
        payload: expanded
      })

      thunkAPI.dispatch({
        type: 'config/setSelected',
        payload: item.id
      })

      return expanded
    }
  )
}

export default new configService()
