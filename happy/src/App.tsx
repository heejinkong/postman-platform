import { Route, Routes } from 'react-router-dom'
import HomeLayout from './features/home/HomeLayout'
import HomePage from './features/home/HomePage'

import WorkspaceLayout from './features/workspaces/WorkspaceLayout'
import WorkspacePage from './features/workspaces/WorkspacePage'
import CollectionLayout from './features/collections/CollectionLayout'
import CollectionPage from './features/collections/CollectionPage'
import RequestLayout from './features/requests/RequestLayout'
import RequestPage from './features/requests/RequestPage'

import './App.css'

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

          <Route path="requests/:requestId" element={<RequestLayout />}>
            <Route index element={<RequestPage />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
