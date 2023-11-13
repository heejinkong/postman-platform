import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import workspacesSlice from '../features/workspaces/workspacesSlice'
import collectionsSlice from '../features/collections/collectionsSlice'
import requestsSlice from '../features/requests/requestsSlice'
import foldersSlice from '../features/folders/foldersSlice'
import configSlice from '../features/config/configSlice'

const persistedWorkspacesReducer = persistReducer(
  {
    key: 'workspaces',
    storage
  },
  workspacesSlice
)

const persistedCollectionsReducer = persistReducer(
  {
    key: 'collections',
    storage
  },
  collectionsSlice
)

const persistedRequestsReducer = persistReducer(
  {
    key: 'requests',
    storage
  },
  requestsSlice
)

const persistedFoldersReducer = persistReducer(
  {
    key: 'folders',
    storage
  },
  foldersSlice
)

const persistedConfigReducer = persistReducer(
  {
    key: 'config',
    storage
  },
  configSlice
)

export const store = configureStore({
  reducer: {
    workspaces: persistedWorkspacesReducer,
    collections: persistedCollectionsReducer,
    requests: persistedRequestsReducer,
    folders: persistedFoldersReducer,
    config: persistedConfigReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
