import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useNavigate } from 'react-router-dom'
import { Box, IconButton, ListItemButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { selectAllWorkspaces } from '../workspacesSlice'
import workspaceService from '../service/workspaceService'
import { workspaceItem } from '../workspaceItem'

export default function WorkspacesList() {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const allWorkspaces = useAppSelector(selectAllWorkspaces)

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
        <List sx={{ width: '100%', maxWidth: 380 }}>
          {allWorkspaces.map((ws) => (
            <ListItemButton key={ws.id} onClick={() => handleNavWorkspace(ws.id)}>
              <ListItemAvatar>
                <Avatar>
                  <PersonOutlineIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={ws.title} secondary={new Date(ws.created).toLocaleString()} />
              <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteClick(e, ws)}>
                <DeleteIcon />
              </IconButton>
            </ListItemButton>
          ))}
        </List>
      </Box>
    )
  }
}
