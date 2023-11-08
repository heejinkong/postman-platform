import List from '@mui/material/List'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useNavigate } from 'react-router-dom'
import { IconButton, ListItemButton, Typography } from '@mui/material'
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
  }

  const handleDeleteClick = (e: { stopPropagation: () => void }, workspaceId: string) => {
    e.stopPropagation()
    dispatch(deleteWorkspaceById(workspaceId))

    const collectionList = allCollections.filter((c) => c.workspaceId === workspaceId)
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
      <List sx={{ width: '100%', maxWidth: 380 }}>
        {allWorkspaces.map((ws) => (
          <ListItemButton key={ws.id} onClick={() => handleNavWorkspace(ws.id)}>
            <ListItemAvatar>
              <Avatar>
                <PersonOutlineIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={ws.title} secondary={new Date(ws.created).toLocaleString()} />
            <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteClick(e, ws.id)}>
              <DeleteIcon />
            </IconButton>
          </ListItemButton>
        ))}
      </List>
    )
  }
}
