import { Box, Button, ButtonGroup, Container, Divider, Drawer, IconButton } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import NavBar from './components/NavBar'
import WorkspaceNavTree from './components/WorkspaceNavTree'
import NewCollection from '../collections/components/NewCollection'
import NewWorkspace from './components/NewWorkspace'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { selectIsOpenDrawer, setDrawerOpen } from '../config/configSlice'

const drawerWidth = 300

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean
}>(({ theme, open }) => ({
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

  const handleDrawerOpen = () => {
    dispatch(setDrawerOpen(true))
  }
  const handleDrawerClose = () => {
    dispatch(setDrawerOpen(false))
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box'
          }
        }}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
      >
        <DrawerHeader />
        <Box>
          <Box sx={{ p: 1, pt: 2 }}>
            <ButtonGroup size="small" variant="outlined" aria-label="outlined button group">
              <NewWorkspace />
              <Button>Import</Button>
              <Button>Export</Button>
            </ButtonGroup>
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
            sx={{
              width: 20,
              zIndex: (theme) => theme.zIndex.drawer + 1
            }}
          >
            <Box
              position="relative"
              sx={{ right: 15, top: 9, ...(!isDrawerOpen && { right: -5 }) }}
            >
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
          <Box
            sx={{
              width: 20,
              ...(!isDrawerOpen && {
                borderLeft: 1,
                borderColor: 'lightgrey'
              })
            }}
          ></Box>
          <Container>
            <Box sx={{ pt: 2 }}>
              <NavBar />
              <Outlet />
            </Box>
          </Container>
        </Box>
      </Main>
    </Box>
  )
}
