import { Box, Button, ButtonGroup } from '@mui/material'

import NewWorkspace from '../../workspaces/components/NewWorkspace'
import NewCollection from '../../collections/components/NewCollection'
import { useAppSelector } from '../../../app/hook'
import { useParams } from 'react-router-dom'
import { selectWorkspaceById } from '../../workspaces/workspacesSlice'
import CollectionsList from '../../collections/components/CollectionsList'

export default function SideBar() {
  const { workspaceId } = useParams()
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', mx: 2 }}>
        <Box>
          <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
            <NewWorkspace />
            <Button>Import</Button>
            <Button>Export</Button>
          </ButtonGroup>
        </Box>
      </Box>
      <Box>
        <Box>{workspace ? <NewCollection /> : null}</Box>
      </Box>
      <Box>{workspace ? <CollectionsList /> : null}</Box>
    </Box>
  )
}
