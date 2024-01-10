import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Divider,
  IconButton,
  ListItemButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableContainer,
  Typography
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { selectAllWorkspaces } from '../service/workspaceSlice'
import workspaceService from '../service/workspaceService'
import { workspaceItem } from '../domain/workspaceEntity'
import { useState } from 'react'

export default function WorkspaceList() {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const allWorkspaces = useAppSelector(selectAllWorkspaces).sort((a, b) => {
    return b.created - a.created
  })

  const rowsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = allWorkspaces.slice(indexOfFirstRow, indexOfLastRow)

  const totalPages = Math.ceil(allWorkspaces.length / rowsPerPage)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const handleNavWorkspace = (workspaceId: string) => {
    navigate(`/workspaces/${workspaceId}`)
  }

  const handleDeleteClick = (e: { stopPropagation: () => void }, workspace: workspaceItem) => {
    e.stopPropagation()
    dispatch(workspaceService.delete(workspace))
  }

  if (allWorkspaces.length === 0) {
    // Workspace가 없을 경우, 아래 문구 표시
    return (
      <Box>
        <Typography variant="h4" gutterBottom sx={{ ml: 10 }}>
          Workspace does not exist
        </Typography>
        <Typography variant="h6" gutterBottom>
          To start your work, try using the 'New Workspace' button at the top.
        </Typography>
      </Box>
    )
  } else {
    // Workspace가 있을 경우, Workspace 목록 표시
    return (
      <Box>
        <Box>
          {/* Workspace 목록 표시 */}
          <TableContainer component={Paper} sx={{ mt: -18, width: 900, ml: 15 }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              {/* 각 Workspace에 대한 정보 표시 */}
              <TableBody>
                {currentRows.map((ws) => (
                  <Box>
                    {/* workspace 목록 클릭시 해당 workspace로 이동 */}
                    <ListItemButton
                      key={ws.id}
                      onClick={() => handleNavWorkspace(ws.id)}
                      sx={{ p: 0.1 }}
                    >
                      {/* workspace에 대한 avatar 표시 */}
                      <ListItemAvatar>
                        <Avatar sx={{ ml: 2, mr: 3, p: 2 }}>
                          <PersonOutlineIcon />
                        </Avatar>
                      </ListItemAvatar>

                      {/* workspace title과 생성 날짜 표시 */}
                      <ListItemText
                        primary={ws.title}
                        secondary={new Date(ws.created).toLocaleString()}
                      />
                      {/* 아이콘 삭제 버튼 클릭 시, 해당 workspace 삭제 */}
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={(e) => handleDeleteClick(e, ws)}
                        sx={{ ml: 50, mr: 2 }}
                        href="/"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemButton>
                    <Divider />
                  </Box>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Workspace 목록 페이지네이션 표시 (리스트 10개로 정렬)*/}
        <Box sx={{ ml: 12, mt: 1.5 }}>
          <Pagination
            count={totalPages}
            shape="rounded"
            page={currentPage}
            onChange={(e, page) => handlePageChange(e, page)}
            sx={{ display: 'flex', justifyContent: 'center', pb: 10 }}
          />
        </Box>
      </Box>
    )
  }
}
