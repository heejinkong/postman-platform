import Link from '@mui/material/Link'
import { useAppSelector } from '../../../app/hook'
import { selectCollectionById } from '../../collections/collectionsSlice'
import { selectRequestById } from '../../requests/requestsSlice'
import { selectFolderById } from '../../folders/foldersSlice'
import { selectWorkspaceById } from '../workspacesSlice'

export default function WorkspaceNavBarItem(props: { _id: string }) {
  const workspace = useAppSelector((state) => selectWorkspaceById(state, props._id))
  const collection = useAppSelector((state) => selectCollectionById(state, props._id))
  const folder = useAppSelector((state) => selectFolderById(state, props._id))
  const request = useAppSelector((state) => selectRequestById(state, props._id))

  if (workspace) {
    return (
      <Link underline="hover" color="inherit" href={`/workspaces/${workspace.id}`}>
        {workspace.title}
      </Link>
    )
  }
  if (collection) {
    return (
      <Link
        underline="hover"
        color="inherit"
        href={`/workspaces/${collection.workspaceId}/collections/${collection.id}`}
      >
        {collection.title}
      </Link>
    )
  }
  if (folder) {
    return (
      <Link
        underline="hover"
        color="inherit"
        href={`/workspaces/${folder.workspaceId}/folders/${folder.id}`}
      >
        {folder.title}
      </Link>
    )
  }
  if (request) {
    return (
      <Link
        underline="hover"
        color="inherit"
        href={`/workspaces/${request.workspaceId}/requests/${request.id}`}
      >
        {request.title}
      </Link>
    )
  }
}
