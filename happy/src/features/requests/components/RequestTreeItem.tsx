import { TreeItem } from '@mui/x-tree-view/TreeItem'
import { Box, IconButton, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectRequestById } from '../service/requestSlice'
import { useState } from 'react'
import requestService from '../service/requestService'
import DeleteIcon from '@mui/icons-material/Delete'
// import CircleIcon from '@mui/icons-material/Circle'

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
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            height: '32px'
          }}
          onClick={(e) => handleNav(e)}
        >
          {/* request의 method에 따라 다른 아이콘 표시 
          (기본값은 method가 GET이며, save버튼 혹은 send 버튼을 클릭해야만 확인 가능) */}
          {request.method === 'GET' ? (
            <Box>
              <Typography style={{ color: '#2E7D32', fontWeight: 500 }} fontSize="inherit">
                GET
              </Typography>
            </Box>
          ) : request.method === 'POST' ? (
            <Typography style={{ color: '#E65100', fontWeight: 500 }} fontSize="inherit">
              POST
            </Typography>
          ) : request.method === 'PUT' ? (
            <Typography style={{ color: '#673AB7', fontWeight: 500 }} fontSize="inherit">
              PUT
            </Typography>
          ) : request.method === 'DELETE' ? (
            <Typography style={{ color: '#795548', fontWeight: 500 }} fontSize="inherit">
              DELETE
            </Typography>
          ) : null}

          {/* request title 표시 */}
          <Tooltip title={request.title} arrow>
            <Box sx={{ flexGrow: 1, marginLeft: '4px' }}>
              {request.title.length > 13 ? `${request.title.slice(0, 13)}...` : request.title}{' '}
            </Box>
          </Tooltip>

          {/* <CircleIcon
            sx={{ width: '16px', height: '16px', marginRight: '4px', color: '#F44336' }}
          /> */}
          {/* request label에 마우스 호버 시, request 삭제 버튼 노출 */}
          <IconButton size="small" sx={{ opacity: hover ? 1 : 0 }} onClick={(e) => handleDelete(e)}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        </Box>
      }
    ></TreeItem>
  )
}
