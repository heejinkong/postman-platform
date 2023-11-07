import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import FolderIcon from '@mui/icons-material/Folder'
import { useNavigate } from 'react-router-dom'
import { Box, IconButton, ListItemButton, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { deleteWorkspaceById, selectAllWorkspaces } from '../workspacesSlice'
import { deleteCollectionById, selectAllCollections } from '../../collections/collectionsSlice'

export default function WorkspacesList() {
  const navigate = useNavigate()

  const dispatch = useAppDispatch()
  const allWorkspaces = useAppSelector(selectAllWorkspaces)
  const allCollections = useAppSelector(selectAllCollections)

  const handleNavWorkspace = (workspaceId: string) => {
    navigate(`/workspaces/${workspaceId}`)
    console.log('handleNavWorkspace')
  }

  const handleDeleteClick = (e: { stopPropagation: () => void }, workspaceId: string) => {
    e.stopPropagation()
    dispatch(deleteWorkspaceById(workspaceId))

    const collectionList = allCollections.filter((c) => c.parentId === workspaceId)
    collectionList.map((c) => dispatch(deleteCollectionById(c.id)))
  }

  if (allWorkspaces.length === 0) {
    return (
      <Typography variant="h5" gutterBottom>
        Workspace가 없어요!
      </Typography>
    )
  } else {
    return (
      <Box>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {allWorkspaces.map((ws) => (
            <ListItemButton key={ws.id} onClick={() => handleNavWorkspace(ws.id)}>
              <ListItemAvatar>
                <Avatar>
                  <FolderIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={ws.title}
                secondary={new Date(ws.created).toLocaleDateString()}
              />
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => handleDeleteClick(e, ws.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemButton>
          ))}
        </List>
      </Box>
    )
  }
}
