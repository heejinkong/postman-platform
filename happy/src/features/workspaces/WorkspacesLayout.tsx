import { Box, Divider, Drawer, IconButton, Typography } from '@mui/material'
import { Outlet, useParams } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import WorkspaceNavTree from './components/WorkspaceNavTree'
import NewCollection from '../collections/components/NewCollection'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { configAction, selectIsOpenDrawer } from '../config/configSlice'
import { selectWorkspaceById } from './service/workspacesSlice'
import WorkspaceOptions from './components/WorkspaceOptions'

const drawerWidth = 300

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
  height: '100%',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  })
}))

const DrawerHeader = styled('div')(({ theme }) => ({
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

export default function WorkspacesLayout() {
  const isDrawerOpen = useAppSelector(selectIsOpenDrawer)
  const dispatch = useAppDispatch()

  const { workspaceId } = useParams()

  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))

  const handleDrawerOpen = () => {
    dispatch(configAction.setDrawerOpen(true))
  }
  const handleDrawerClose = () => {
    dispatch(configAction.setDrawerOpen(false))
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 0
          }
        }}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
      >
        <DrawerHeader />
        <Box>
          <Typography variant="subtitle1" gutterBottom sx={{ ml: 1, mt: 1 }}>
            Workspace
          </Typography>
          <Typography variant="h4" gutterBottom sx={{ ml: 2, color: `#1877F2` }}>
            {workspace.title.length > 10 ? `${workspace.title.slice(0, 10)}...` : workspace.title}
          </Typography>
          <Box sx={{ pb: 2 }}>
            <WorkspaceOptions />
          </Box>
          <Divider />
          <Box
            sx={{ px: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          >
            Collections
            <NewCollection />
          </Box>
          <Divider />
          <Box sx={{ p: 1 }}>
            <WorkspaceNavTree />
          </Box>
        </Box>
      </Drawer>
      <Main open={isDrawerOpen}>
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Box
            position={'fixed'}
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              display: 'flex',
              height: '100%'
            }}
          >
            <Box
              sx={{
                width: 20,
                ...(isDrawerOpen && { display: 'none' })
              }}
            ></Box>
            <Box
              sx={{
                width: 20,
                borderLeft: 1,
                borderColor: 'lightgrey'
              }}
            >
              <Box position="relative" sx={{ right: 15, top: 10 }}>
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerOpen}
                  edge="start"
                  sx={{
                    mr: 2,
                    border: 1,
                    bgcolor: 'white',
                    borderColor: 'lightgrey',
                    ':hover': {
                      bgcolor: 'lightgrey'
                    },
                    ...(isDrawerOpen && { display: 'none' })
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="close drawer"
                  onClick={handleDrawerClose}
                  edge="start"
                  sx={{
                    mr: 2,
                    border: 1,
                    bgcolor: 'white',
                    borderColor: 'lightgrey',
                    ':hover': {
                      bgcolor: 'lightgrey'
                    },
                    ...(!isDrawerOpen && { display: 'none' })
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              ml: 5,
              ...(isDrawerOpen && { ml: 2.5 })
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Main>
    </Box>
  )
}
