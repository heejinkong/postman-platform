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
    navigate(``)
  }

  if (allWorkspaces.length === 0) {
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
    return (
      <Box>
        <Box>
          <TableContainer component={Paper} sx={{ mt: -18, width: 900, ml: 15 }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableBody>
                {currentRows.map((ws) => (
                  <Box>
                    <ListItemButton
                      key={ws.id}
                      onClick={() => handleNavWorkspace(ws.id)}
                      sx={{ p: 0.1 }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ ml: 2, mr: 3, p: 2 }}>
                          <PersonOutlineIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={ws.title}
                        secondary={new Date(ws.created).toLocaleString()}
                      />
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
