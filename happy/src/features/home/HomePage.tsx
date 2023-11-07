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
      <Box>
        <Box sx={{ mb: 2 }}>
          <WorkspacesList />
        </Box>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <NewWorkspace />
        </Box>
      </Box>
    </Container>
  )
}
