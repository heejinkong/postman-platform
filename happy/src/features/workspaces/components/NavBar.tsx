import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import { selectAllWorkspace } from '../workspacesSlice'
import { selectAllCollection } from '../../collections/collectionsSlice'

export default function NavBar() {
  const {workspaceId, collectionId, requestId} = useParams()
  
  // 현재 workspaceId의 해당하는 workspace를 찾아서 title을 가져온다.
  const allWorkspaces = useAppSelector(selectAllWorkspace)
  const workspaceTitle = allWorkspaces.find((ws) => ws.id === Number(workspaceId))?.title
 
  const allCollections = useAppSelector(selectAllCollection)
  const collectionTitle = allCollections.find((c) => c.id === Number(collectionId))?.title

  return (
    <div role="presentation">
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href={`/workspaces/${workspaceId}`}>
          {workspaceTitle || 'Workspace'}
        </Link>
        {collectionId && (
          <Link underline="hover" color="inherit" href={`/workspaces/${workspaceId}/collections/${collectionId}`}>
            {collectionTitle || 'Collection'}
          </Link>
        )}
        {/* {requestId && (
          <Link underline="hover" color="inherit" href={`/workspaces/${workspaceId}/collections/${collectionId}/requests/${requestId}`}>
            {requestId || 'Request'}
            </Link>
        )} */}
       
      </Breadcrumbs>
    </div>
  )
}
