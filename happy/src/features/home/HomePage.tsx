import { Box, Container, Paper, Typography } from '@mui/material'
import WorkspacesList from '../workspaces/components/WorkspacesList'
import NewWorkspace from '../workspaces/components/NewWorkspace'

export default function HomePage() {
  return (
    <Container
      sx={{
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          justifyContent: 'center',
          backgroundColor: '#FAFAFB',
          height: '15%',
          width: '200%',
          ml: -70.46,
          mt: 0
        }}
      >
        <Box>
          <Typography variant="h3" display="block" gutterBottom sx={{ ml: 70 }}>
            Workspace List
          </Typography>

          <Typography variant="body1" display="block" gutterBottom sx={{ mt: 7, ml: 70 }}>
            Please select the workspace you'd like to move to.
          </Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 20 }}>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <WorkspacesList />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <NewWorkspace />
          </Box>
        </Box>
      </Box>
    </Container>
  )
}
