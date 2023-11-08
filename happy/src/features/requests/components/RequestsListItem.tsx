import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteRequestById, selectRequestById } from '../requestsSlice'
import React from 'react'
import { selectCollectionById, updateCollection } from '../../collections/collectionsSlice'
import SendIcon from '@mui/icons-material/Send'
import { ListItemIcon } from '@mui/material'
import { selectFolderById, updateFolder } from '../../folders/foldersSlice'
import { collectionItem } from '../../collections/collectionItem'
import { folderItem } from '../../folders/folderItem'

type requestItemProps = {
  requestId: string
}

export default function RequestsListItem(props: requestItemProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const location = useLocation()

  const [hover, setHover] = React.useState(false)

  const request = useAppSelector((state) => selectRequestById(state, props.requestId))
  const collection = useAppSelector((state) => selectCollectionById(state, request?.parentId ?? ''))
  const folder = useAppSelector((state) => selectFolderById(state, request?.parentId ?? ''))

  const handleNavRequest = () => {
    navigate(`/workspaces/${request.workspaceId}/requests/${request.id}`)
  }

  const isCurrentURL =
    location.pathname === `/workspaces/${request.workspaceId}/requests/${request.id}`

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (collection) {
      // collection의 requests 배열에서 request.id를 찾아서 삭제
      const cloned = JSON.parse(JSON.stringify(collection)) as collectionItem
      cloned.requests = cloned.requests.filter((id: string) => id !== request.id)
      dispatch(updateCollection(cloned))

      // request 삭제
      dispatch(deleteRequestById(request.id))
    } else if (folder) {
      // folder의 requests 배열에서 request.id를 찾아서 삭제
      const cloned = JSON.parse(JSON.stringify(folder)) as folderItem
      cloned.requests = cloned.requests.filter((id: string) => id !== request.id)
      dispatch(updateFolder(cloned))

      // request 삭제
      dispatch(deleteRequestById(request.id))
    }

    navigate(`/workspaces/${request.workspaceId}/collections/${collection.id}`)
  }

  if (request) {
    return (
      <ListItemButton
        sx={{ pl: 4, bgcolor: isCurrentURL ? `lightgray` : `` }}
        onClick={() => handleNavRequest()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary={request?.title} />
        <IconButton sx={{ opacity: hover ? 1 : 0 }} onClick={(e) => handleDeleteClick(e)}>
          <DeleteIcon />
        </IconButton>
      </ListItemButton>
    )
  } else {
    return <></>
  }
}
