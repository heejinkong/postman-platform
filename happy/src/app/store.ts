import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import workspaceSlice from '../features/workspaces/service/workspaceSlice'
import collectionSlice from '../features/collections/service/collectionSlice'
import requestSlice from '../features/requests/service/requestSlice'
import folderSlice from '../features/folders/service/folderSlice'
import configSlice from '../features/config/configSlice'
import runTestSlice from '../features/runTests/service/runTestSlice'
import runResultSlice from '../features/runResults/service/runResultSlice'
import globalsSlice from '../features/globalsVariable/service/globalsSlice'

const persistedWorkspacesReducer = persistReducer(
  {
    key: 'workspaces',
    storage,
    version: 1
  },
  workspaceSlice
)

const persistedCollectionsReducer = persistReducer(
  {
    key: 'collections',
    storage,
    version: 1
  },
  collectionSlice
)

const persistedRequestsReducer = persistReducer(
  {
    key: 'requests',
    storage,
    version: 1
  },
  requestSlice
)

const persistedFoldersReducer = persistReducer(
  {
    key: 'folders',
    storage,
    version: 1
  },
  folderSlice
)

const persistedConfigReducer = persistReducer(
  {
    key: 'config',
    storage,
    version: 2
  },
  configSlice
)

const persistedRunTestsReducer = persistReducer(
  {
    key: 'runTests',
    storage,
    version: 1
  },
  runTestSlice
)

const persistedRunResultsReducer = persistReducer(
  {
    key: 'runResults',
    storage,
    version: 1
  },
  runResultSlice
)

const persistGlobalsReducer = persistReducer(
  {
    key: 'globals',
    storage,
    version: 1
  },
  globalsSlice
)

export const store = configureStore({
  reducer: {
    workspaces: persistedWorkspacesReducer,
    collections: persistedCollectionsReducer,
    requests: persistedRequestsReducer,
    folders: persistedFoldersReducer,
    config: persistedConfigReducer,
    runTests: persistedRunTestsReducer,
    runResults: persistedRunResultsReducer,
    globals: persistGlobalsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
