import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import DeleteIcon from '@mui/icons-material/Delete'
import { selectRequestById } from '../requestsSlice'
import React from 'react'
import SendIcon from '@mui/icons-material/Send'
import requestService from '../service/requestService'

type requestItemProps = {
  requestId: string
}

export default function RequestsListItem(props: requestItemProps) {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const request = useAppSelector((state) => selectRequestById(state, props.requestId))

  const [hover, setHover] = React.useState(false)

  const handleNavRequest = () => {
    navigate(`/workspaces/${request.workspaceId}/requests/${request.id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    dispatch(requestService.delete(request))

    navigate(`/workspaces/${request.workspaceId}`)
  }

  if (request) {
    return (
      <ListItemButton
        sx={{ pl: 4 }}
        onClick={() => handleNavRequest()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        dense
      >
        <SendIcon />
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
