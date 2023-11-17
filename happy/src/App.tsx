import { Route, Routes } from 'react-router-dom'
import HomeLayout from './features/home/HomeLayout'
import HomePage from './features/home/HomePage'
import NotFoundPage from './NotFoundPage'
import WorkspacesLayout from './features/workspaces/WorkspacesLayout'
import WorkspacesPage from './features/workspaces/WorkspacesPage'
import CollectionsLayout from './features/collections/CollectionsLayout'
import CollectionsPage from './features/collections/CollectionsPage'
import RequestsLayout from './features/requests/RequestsLayout'
import RequestsPage from './features/requests/RequestsPage'
import FoldersLayout from './features/folders/FoldersLayout'
import FoldersPage from './features/folders/FoldersPage'
import RunHistoryLayout from './features/runHistory/RunHistoryLayout'
import RunHistoryPage from './features/runHistory/RunHistoryPage'
import RunResultLayout from './features/runResults/runResultLayout'
import RunTestLayout from './features/runTests/RunTestLayout'
import RunTestPage from './features/runTests/RunTestPage'
import RunResultPage from './features/runResults/runResultPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="workspaces/:workspaceId" element={<WorkspacesLayout />}>
          <Route index element={<WorkspacesPage />} />
          <Route path="collections/:collectionId" element={<CollectionsLayout />}>
            <Route index element={<CollectionsPage />} />
          </Route>
          <Route path="folders/:folderId" element={<FoldersLayout />}>
            <Route index element={<FoldersPage />} />
          </Route>
          <Route path="requests/:requestId" element={<RequestsLayout />}>
            <Route index element={<RequestsPage />} />
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
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
