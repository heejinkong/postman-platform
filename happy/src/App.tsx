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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<HomePage />} />
        <Route path="workspaces/:workspaceId" element={<WorkspacesLayout />}>
          <Route index element={<WorkspacesPage />} />
          <Route path="collections" element={<CollectionsLayout />}>
            <Route path="new" element={<>NewCollectionPage.tsx</>} />
            <Route path=":collectionId" element={<CollectionsPage />} />
            <Route path=":collectionId/requests" element={<RequestsLayout />}>
              <Route path="new" element={<>NewRequestPage.tsx</>} />
              <Route path=":requestId" element={<RequestsPage />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App
