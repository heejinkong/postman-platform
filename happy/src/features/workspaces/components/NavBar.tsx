import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import { selectWorkspaceById } from '../workspacesSlice'
import { selectCollectionById } from '../../collections/collectionsSlice'
import { selectRequestById } from '../../requests/requestsSlice'

export default function NavBar() {
  const { workspaceId, collectionId, requestId } = useParams()

  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))
  const collection = useAppSelector((state) => selectCollectionById(state, collectionId ?? ''))
  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))

  return (
    <div role="presentation">
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        {workspace ? (
          <Link underline="hover" color="inherit" href={`/workspaces/${workspace.id}`}>
            {workspace.title}
          </Link>
        ) : null}
        {collection ? (
          <Link
            underline="hover"
            color="inherit"
            href={`/workspaces/${workspace.id}/collections/${collection.id}`}
          >
            {collection.title}
          </Link>
        ) : null}
        {request ? (
          <Link
            underline="hover"
            color="inherit"
            href={`/workspaces/${workspace.id}/collections/${collection.id}/requests/${request.id}`}
          >
            {request.title}
          </Link>
        ) : null}
      </Breadcrumbs>
    </div>
  )
}
