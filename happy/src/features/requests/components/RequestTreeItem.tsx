import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { Box, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectRequestById } from '../service/requestSlice'
import { useState } from 'react'
import requestService from '../service/requestService'
import DeleteIcon from '@mui/icons-material/Delete'
import SendIcon from '@mui/icons-material/Send'

type TreeItemProps = {
  _id: string
}

export default function RequestTreeItem(props: TreeItemProps) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)
  const dispatch = useAppDispatch()
  const request = useAppSelector((state) => selectRequestById(state, props._id))
  if (!request) {
    return null
  }

  const handleNav = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    navigate(`/workspaces/${request.workspaceId}/requests/${request.id}`)
  }

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    dispatch(requestService.delete(request))
    navigate(`/workspaces/${request.workspaceId}`)
  }

  return (
    <TreeItem
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      nodeId={request.id}
      label={
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={(e) => handleNav(e)}
        >
          <SendIcon fontSize="inherit" />
          <Box sx={{ flexGrow: 1, px: 1 }}>{request.title}</Box>
          <IconButton size="small" sx={{ opacity: hover ? 1 : 0 }} onClick={(e) => handleDelete(e)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
      }
    ></TreeItem>
  )
}
