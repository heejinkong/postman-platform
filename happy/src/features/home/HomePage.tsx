import { Box, Container } from '@mui/material'
import WorkspacesList from '../workspaces/components/WorkspacesList'
import NewWorkspace from '../workspaces/components/NewWorkspace'

export default function HomePage() {
  return (
    <Container
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <WorkspacesList />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <NewWorkspace />
        </Box>
      </Box>
    </Container>
  )
}
