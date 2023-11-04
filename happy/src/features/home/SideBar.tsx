import { Box, Button, ButtonGroup } from '@mui/material'
import SideList from '../workspaces/components/SideList'
import NewWorkspace from './NewWorkspace'
import NewCollection from '../collections/components/NewCollection'

export default function SideBar() {
  const path = window.location.pathname.split(`/`)[1]
  console.log(path)

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
        <NewCollection />
      </Box>
      <Box>{path !== ''  ? <SideList /> : null}</Box>
    </Box>
  )
}
