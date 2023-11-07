import { Box } from '@mui/joy'
import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteRequestById, selectRequestById } from '../requestsSlice'
import React from 'react'
import { selectCollectionById, updateCollection } from '../../collections/collectionsSlice'

type requestItemProps = {
  requestId: string
}

export default function RequestsListItem(props: requestItemProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const request = useAppSelector((state) => selectRequestById(state, props.requestId))
  const collection = useAppSelector((state) => selectCollectionById(state, request?.parentId ?? ''))

  const handleNavRequest = () => {
    navigate(
      `/workspaces/${collection.parentId}/collections/${request.parentId}/requests/${request.id}`
    )
  }

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    // collection의 requests 배열에서 request.id를 찾아서 삭제
    const cloned = JSON.parse(JSON.stringify(collection))
    cloned.requests = cloned.requests.filter((id: string) => id !== request.id)
    dispatch(updateCollection(cloned))

    // request 삭제
    dispatch(deleteRequestById(request.id))
  }

  if (request) {
    return (
      <Box>
        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavRequest()}>
          <ListItemText primary={request?.title} />
          <IconButton onClick={(e) => handleDeleteClick(e)}>
            <DeleteIcon />
          </IconButton>
        </ListItemButton>
      </Box>
    )
  } else {
    return <></>
  }
}
