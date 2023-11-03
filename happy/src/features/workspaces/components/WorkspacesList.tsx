import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import FolderIcon from '@mui/icons-material/Folder'
import { useNavigate } from 'react-router-dom'
import { Box, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteById, selectAllWorkspace } from '../workspacesSlice'

export default function WorkspacesList() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const allWorkspaces = useAppSelector(selectAllWorkspace)

  const handleNavWorkspace = (workspaceId: number) => {
    navigate(`/workspaces/${workspaceId}`)
    console.log('handleNavWorkspace')
  }

  const handleDeleteClick = (e: { stopPropagation: () => void }, workspaceId: number) => {
    e.stopPropagation()
    dispatch(deleteById(workspaceId))
  }

  if (allWorkspaces.length === 0) {
    return <Box>Workspace가 없어요</Box>
  } else {
    return (
      <Box>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {allWorkspaces.map((ws) => (
            <ListItem
              key={ws.id}
              onClick={() => handleNavWorkspace(ws.id)}
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => handleDeleteClick(e, ws.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={ws.title}
                secondary={new Date(ws.created).toLocaleDateString()}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }
}
