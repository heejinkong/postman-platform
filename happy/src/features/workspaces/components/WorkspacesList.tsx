import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useNavigate } from 'react-router-dom'
import { Box, IconButton, ListItemButton, Pagination, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { selectAllWorkspaces } from '../workspacesSlice'
import workspaceService from '../service/workspaceService'
import { workspaceItem } from '../workspaceItem'
import { useState } from 'react'

export default function WorkspacesList() {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const allWorkspaces = useAppSelector(selectAllWorkspaces)

  //allWorkspaces를 최대 10개씩 나눠서 pagination으로 보여줄거야
  const rowsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = allWorkspaces.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(allWorkspaces.length / rowsPerPage)

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
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
    return (
      <Box>
        <Typography variant="h3" gutterBottom sx={{ ml: 3 }}>
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
          <List sx={{ width: '100%', maxWidth: 380 }}>
            {currentRows.map((ws) => (
              <ListItemButton key={ws.id} onClick={() => handleNavWorkspace(ws.id)}>
                <ListItemAvatar>
                  <Avatar>
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
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemButton>
            ))}
          </List>
        </Box>
        <Box>
          <Pagination
            count={totalPages}
            shape="rounded"
            page={currentPage}
            onChange={(e, page) => handlePageChange(e, page)}
            sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}
          />
        </Box>
      </Box>
    )
  }
}
