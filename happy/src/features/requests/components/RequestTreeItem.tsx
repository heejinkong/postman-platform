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
    /* Sidebar에 TreeItem 기능을 사용하여 request 표시 */
    <TreeItem
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      nodeId={request.id}
      /* label에 request title 표시하고, label 클릭시 해당 request로 이동 */
      label={
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={(e) => handleNav(e)}
        >
          {/* request의 method에 따라 다른 아이콘 표시 */}
          {request.method === 'GET' ? (
            <SendIcon style={{ color: '#2E7D32' }} fontSize="inherit" />
          ) : request.method === 'POST' ? (
            <SendIcon style={{ color: '#E65100' }} fontSize="inherit" />
          ) : request.method === 'PUT' ? (
            <SendIcon style={{ color: '#1877F2' }} fontSize="inherit" />
          ) : request.method === 'DELETE' ? (
            <SendIcon style={{ color: '#795548' }} fontSize="inherit" />
          ) : null}

          {/* request title 표시 */}
          <Box sx={{ flexGrow: 1, px: 1 }}>{request.title}</Box>

          {/* request label에 마우스 호버 시, request 삭제 버튼 노출 */}
          <IconButton size="small" sx={{ opacity: hover ? 1 : 0 }} onClick={(e) => handleDelete(e)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
      }
    ></TreeItem>
  )
}
