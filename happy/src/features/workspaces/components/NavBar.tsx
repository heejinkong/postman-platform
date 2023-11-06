import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import { selectAllWorkspace } from '../workspacesSlice'
import { selectAllCollection } from '../../collections/collectionsSlice'
import { selectAllRequest } from '../../requests/requestsSlice'

export default function NavBar() {
  const { workspaceId, collectionId, requestId } = useParams()

  const allWorkspaces = useAppSelector(selectAllWorkspace)
  const workspaceTitle = allWorkspaces.find((ws) => ws.id === Number(workspaceId))?.title

  const allCollections = useAppSelector(selectAllCollection)
  const collectionTitle = allCollections.find((c) => c.id === Number(collectionId))?.title

  const allRequests = useAppSelector(selectAllRequest)
  const requestTitle = allRequests.find((rq) => rq.id === Number(requestId))?.title

  return (
    <div role="presentation">
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href={`/workspaces/${workspaceId}`}>
          {workspaceTitle || 'Workspace'}
        </Link>
        {collectionId && (
          <Link
            underline="hover"
            color="inherit"
            href={`/workspaces/${workspaceId}/collections/${collectionId}`}
          >
            {collectionTitle || 'Collection'}
          </Link>
        )}
        {requestId && (
          <Link
            underline="hover"
            color="inherit"
            href={`/workspaces/${workspaceId}/collections/${collectionId}/requests/${requestId}`}
          >
            {requestTitle || 'Request'}
          </Link>
        )}
      </Breadcrumbs>
    </div>
  )
}
