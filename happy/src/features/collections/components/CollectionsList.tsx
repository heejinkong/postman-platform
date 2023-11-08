import List from '@mui/material/List'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import CollectionsListItem from './CollectionsListItem'
import { Box, Button, ListSubheader } from '@mui/material'
import NewCollection from './NewCollection'
import { selectWorkspaceById } from '../../workspaces/workspacesSlice'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline'

export default function CollectionsList() {
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))

  if (!workspace) {
    navigate('/NotFoundPage')
    return <></>
  }

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="text"
              size="small"
              startIcon={<PersonOutlineIcon />}
              onClick={() => {
                navigate(`/workspaces/${workspace.id}`)
              }}
            >
              {workspace.title}
            </Button>
            <NewCollection />
          </Box>
        </ListSubheader>
      }
    >
      {workspace.collections.map((collectionId) => (
        <CollectionsListItem key={collectionId} collectionId={collectionId} />
      ))}
    </List>
  )
}
