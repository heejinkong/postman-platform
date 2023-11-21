import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import workspacesSlice from '../features/workspaces/service/workspacesSlice'
import collectionsSlice from '../features/collections/service/collectionsSlice'
import requestsSlice from '../features/requests/service/requestsSlice'
import foldersSlice from '../features/folders/service/foldersSlice'
import configSlice from '../features/config/configSlice'
import runTestSlice from '../features/runTests/service/runTestSlice'
import runResultSlice from '../features/runResults/service/runResultSlice'

const persistedWorkspacesReducer = persistReducer(
  {
    key: 'workspaces',
    storage,
    version: 1
  },
  workspacesSlice
)

const persistedCollectionsReducer = persistReducer(
  {
    key: 'collections',
    storage,
    version: 1
  },
  collectionsSlice
)

const persistedRequestsReducer = persistReducer(
  {
    key: 'requests',
    storage,
    version: 1
  },
  requestsSlice
)

const persistedFoldersReducer = persistReducer(
  {
    key: 'folders',
    storage,
    version: 1
  },
  foldersSlice
)

const persistedConfigReducer = persistReducer(
  {
    key: 'config',
    storage,
    version: 1
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

export const store = configureStore({
  reducer: {
    workspaces: persistedWorkspacesReducer,
    collections: persistedCollectionsReducer,
    requests: persistedRequestsReducer,
    folders: persistedFoldersReducer,
    config: persistedConfigReducer,
    runTests: persistedRunTestsReducer,
    runResults: persistedRunResultsReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
