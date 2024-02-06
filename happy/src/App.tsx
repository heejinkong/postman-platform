import { Route, Routes } from 'react-router-dom'
import HomeLayout from './features/home/HomeLayout'
import HomePage from './features/home/HomePage'
import NotFoundPage from './NotFoundPage'
import WorkspaceLayout from './features/workspaces/WorkspaceLayout'
import WorkspacePage from './features/workspaces/WorkspacePage'
import CollectionLayout from './features/collections/CollectionLayout'
import CollectionPage from './features/collections/CollectionPage'
import RequestLayout from './features/requests/RequestLayout'
import RequestPage from './features/requests/RequestPage'
import FolderLayout from './features/folders/FolderLayout'
import FolderPage from './features/folders/FolderPage'
import RunHistoryLayout from './features/runHistory/RunHistoryLayout'
import RunHistoryPage from './features/runHistory/RunHistoryPage'
import RunTestLayout from './features/runTests/RunTestLayout'
import RunTestPage from './features/runTests/RunTestPage'
import RunResultLayout from './features/runResults/runResultLayout'
import RunResultPage from './features/runResults/runResultPage'

import './App.css'
import GlobalsLayout from './features/globalsVariable/GlobalsLayout'
import GlobalsPage from './features/globalsVariable/GlobalsPage'
function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="workspaces/:workspaceId" element={<WorkspaceLayout />}>
          <Route index element={<WorkspacePage />} />
          <Route path="collections/:collectionId" element={<CollectionLayout />}>
            <Route index element={<CollectionPage />} />
          </Route>
          <Route path="folders/:folderId" element={<FolderLayout />}>
            <Route index element={<FolderPage />} />
          </Route>
          <Route path="requests/:requestId" element={<RequestLayout />}>
            <Route index element={<RequestPage />} />
          </Route>
          <Route path="runHistory" element={<RunHistoryLayout />}>
            <Route index element={<RunHistoryPage />} />
          </Route>
          <Route path="runResult/:runResultId" element={<RunResultLayout />}>
            <Route index element={<RunResultPage />} />
          </Route>
          <Route path="runTest" element={<RunTestLayout />}>
            <Route index element={<RunTestPage />} />
          </Route>
          <Route path="globals" element={<GlobalsLayout />}>
            <Route index element={<GlobalsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
