import { Avatar, Box, Container, Paper, Typography } from '@mui/material'
import WorkspacesList from '../workspaces/components/WorkspacesList'
import NewWorkspace from '../workspaces/components/NewWorkspace'
import { useAppSelector } from '../../app/hook'
import { selectAllWorkspaces } from '../workspaces/workspacesSlice'

export default function HomePage() {
  const allWorkspaces = useAppSelector(selectAllWorkspaces)

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
          mt: -12.5,
          ml: -70,
          width: '200%',
          height: '27%',
          backgroundColor: '#FAFAFB'
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ mt: 9, display: 'flex' }}>
            <Box sx={{ ml: 80 }}>
              <Typography
                variant="h4"
                display="block"
                gutterBottom
                sx={{ justifyItems: 'center', mt: 13, fontWeight: 'bold' }}
              >
                Workspace List
              </Typography>
              <Typography variant="body1" display="block" gutterBottom>
                Please select the workspace you'd like to move to.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ ml: 65 }}>
            <Avatar
              alt="ToolBal Icon"
              src="/icon.jpg"
              sx={{
                width: '170px',
                height: '170px',
                mr: '-150px',
                mt: '140px',
                borderRadius: '12px'
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 20 }}>
        {allWorkspaces.length !== 0 ? (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', ml: 120, mt: -18 }}>
              <NewWorkspace />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20 }}>
              <WorkspacesList />
            </Box>
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 33 }}>
              <WorkspacesList />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <NewWorkspace />
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  )
}
