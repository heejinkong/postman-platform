import { Box, Button, ButtonGroup, Divider } from '@mui/material'
import NewWorkspace from '../../workspaces/components/NewWorkspace'
import { useAppSelector } from '../../../app/hook'
import { useParams } from 'react-router-dom'
import { selectWorkspaceById } from '../../workspaces/workspacesSlice'
import CollectionsList from '../../collections/components/CollectionsList'

export default function SideBar() {
  const { workspaceId } = useParams()
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))

  return (
    <Box sx={{ alignItems: `center` }}>
      <Box sx={{ pb: 2, mt: 2, ml: 4 }}>
        <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
          <NewWorkspace />
          <Button>Import</Button>
          <Button>Export</Button>
        </ButtonGroup>
      </Box>
      <Divider />
      <Box sx={{ pt: 2 }}>{workspace ? <CollectionsList /> : null}</Box>
    </Box>
  )
}
