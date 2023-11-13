import { Box, Button, ButtonGroup, Container, Divider } from '@mui/material'
import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'
import WorkspaceNavTree from './components/WorkspaceNavTree'
import NewCollection from '../collections/components/NewCollection'
import NewWorkspace from './components/NewWorkspace'

export default function WorkspacesLayout() {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box>
        <Box sx={{ p: 1 }}>
          <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
            <NewWorkspace />
            <Button>Import</Button>
            <Button>Export</Button>
          </ButtonGroup>
        </Box>
        <Divider />
        <Box sx={{ px: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          Collections
          <NewCollection />
        </Box>
        <Divider />
        <Box sx={{ p: 1 }}>
          <WorkspaceNavTree />
        </Box>
      </Box>
      <Divider orientation="vertical" />
      <Container sx={{ flexGrow: 1 }}>
        <Box sx={{ pt: 2 }}>
          <NavBar />
          <Outlet />
        </Box>
      </Container>
    </Box>
  )
}
