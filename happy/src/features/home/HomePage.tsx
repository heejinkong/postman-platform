import { Avatar, Box, Typography } from '@mui/material'
import WorkspacesList from '../workspaces/components/WorkspacesList'
import NewWorkspace from '../workspaces/components/NewWorkspace'
import { useAppSelector } from '../../app/hook'
import { selectAllWorkspaces } from '../workspaces/workspacesSlice'

export default function HomePage() {
  const allWorkspaces = useAppSelector(selectAllWorkspaces)

  return (
    <Box>
      <Box
        sx={{
          height: '160px',
          backgroundColor: '#FAFAFB'
        }}
      >
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ ml: 60, mt: -5 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h4"
                display="block"
                gutterBottom
                sx={{ justifyItems: 'center', mt: 11, fontWeight: 'bold' }}
              >
                Workspace List
              </Typography>
              <Typography
                variant="body1"
                display="block"
                gutterBottom
                sx={{ mt: 18, ml: -29.5, mr: 50 }}
              >
                Please select the workspace you'd like to move to.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ mt: -16.5 }}>
            <Avatar
              alt="ToolBal Icon"
              src="/icon.jpg"
              sx={{
                width: '150px',
                height: '150px',
                mr: '-110px',
                mt: '140px',
                borderRadius: '12px'
              }}
            />
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 20, alignItems: 'center', justifyContent: 'center' }}>
        {allWorkspaces.length !== 0 ? (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', ml: 150.5, mt: -18 }}>
              <NewWorkspace />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20, mr: 23 }}>
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
      {/* <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Box sx={{ minWidth: 750, pt: 20, p: 30 }}>
          {allWorkspaces.length !== 0 ? (
            <Box>
              <Box sx={{ justifyContent: 'end', pt: -10 }}>
                <NewWorkspace />
              </Box>
              <Box>
                <WorkspacesList />
              </Box>
            </Box>
          ) : (
            <Box sx={{ width: '100%' }}>
              <Box>
                <WorkspacesList />
              </Box>
              <Box>
                <NewWorkspace />
              </Box>
            </Box>
          )}
        </Box>
      </Box> */}
    </Box>
  )
}
