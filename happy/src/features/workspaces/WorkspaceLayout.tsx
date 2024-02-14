import { Box, Divider, Drawer, IconButton, Link, Typography } from '@mui/material';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import WorkspaceNavTree from './components/WorkspaceNavTree';
import NewCollection from '../collections/components/NewCollection';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { configAction, selectIsOpenDrawer } from '../config/configSlice';
import { selectWorkspaceById } from './service/workspaceSlice';
import WorkspaceOptions from './components/WorkspaceOptions';

const drawerWidth = 300;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  height: '100%',
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

export default function WorkspacesLayout() {
  const navigate = useNavigate();
  const isDrawerOpen = useAppSelector(selectIsOpenDrawer);
  const dispatch = useAppDispatch();

  const { workspaceId } = useParams();

  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''));

  const handleDrawerOpen = () => {
    dispatch(configAction.setDrawerOpen(true));
  };
  const handleDrawerClose = () => {
    dispatch(configAction.setDrawerOpen(false));
  };

  return (
    /* WorkspaceLayout 컴포넌트는 Workspace 페이지의 레이아웃을 담당하는 컴포넌트 */
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Sidebar에 Drawer 기능을 사용하여 WorkspaceNavTree 컴포넌트를 표시 */}
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            border: 0,
          },
        }}
        variant='persistent'
        anchor='left'
        open={isDrawerOpen}
      >
        <DrawerHeader />
        <Box sx={{ backgroundColor: '#ECEDEE', height: '100%' }}>
          <Box sx={{ backgroundColor: '#fff' }}>
            {/*Sidebar 상단 'workspace' 문구 표시 */}
            <Typography
              variant='subtitle1'
              gutterBottom
              sx={{ padding: '16px 12px 8px 16px', fontSize: '12px', color: 'rgba(0,0,0,.6)' }}
            >
              Workspace
            </Typography>

            {/*Sidebar 상단 Workspace title 클릭 시, 해당 Workspace로 이동 */}
            <Link
              sx={{ textDecoration: 'none' }}
              component='button'
              onClick={() => {
                navigate(`/workspaces/${workspaceId}`);
              }}
            >
              {/* workspace title이 10자 이상일 경우, 10자까지만 표시하고 이후에는 '...'으로 표시 */}
              <Typography
                variant='h4'
                gutterBottom
                sx={{ padding: '0 12px 16px 16px', fontSize: '16px', color: 'rgba(0,0,0,.9)' }}
              >
                {workspace.title.length > 20 ? `${workspace.title.slice(0, 20)}...` : workspace.title}
              </Typography>
            </Link>
            {/*Sidebar 상단 workspace title 아래에 workspace options 버튼 표시 */}
            <Box sx={{ pb: 2 }}>
              <WorkspaceOptions />
            </Box>
          </Box>
          <Divider />

          {/*Sidebar영역, 'collections' 문구 표시 */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px 8px 16px',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Collections
            <NewCollection />
          </Box>
          <Divider />

          {/*Sidebar영역, WorkspaceNavTree 컴포넌트 표시 */}
          <Box>
            <WorkspaceNavTree />
          </Box>
        </Box>
      </Drawer>

      <Main open={isDrawerOpen}>
        {/* Main 영역 상단에 Drawer 기능을 사용하여 Sidebar를 표시 */}
        <Box sx={{ display: 'flex', height: '100%' }}>
          <Box
            position={'fixed'}
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              display: 'flex',
              height: '100%',
            }}
          >
            <Box
              sx={{
                width: 20,
                ...(isDrawerOpen && { display: 'none' }),
              }}
            ></Box>
            <Box
              sx={{
                width: 24,
                borderLeft: 1,
                borderColor: 'lightgrey',
              }}
            >
              <Box position='relative' sx={{ right: 20, top: 8 }}>
                {/* icon button을 사용하여 Sidebar를 열고 닫는 기능 구현 */}
                <IconButton
                  size='small'
                  color='inherit'
                  aria-label='open drawer'
                  onClick={handleDrawerOpen}
                  edge='start'
                  sx={{
                    width: '32px',
                    margin: '4px',
                    height: '32px',
                    border: 1,
                    bgcolor: 'white',
                    borderColor: 'lightgrey',
                    ':hover': {
                      bgcolor: '#1877F2',
                      color: '#fff',
                    },
                    ...(isDrawerOpen && { display: 'none' }),
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
                <IconButton
                  size='small'
                  color='inherit'
                  aria-label='close drawer'
                  onClick={handleDrawerClose}
                  edge='start'
                  sx={{
                    width: '32px',
                    height: '32px',
                    margin: '4px',
                    border: 1,
                    bgcolor: 'white',
                    borderColor: 'lightgrey',
                    ':hover': {
                      bgcolor: '#1877F2',
                      color: '#fff',
                    },
                    ...(!isDrawerOpen && { display: 'none' }),
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Main 영역에 Outlet 기능을 사용하여 페이지를 표시 */}
          <Box
            sx={{
              flexGrow: 1,
              ml: '44px',
              ...(isDrawerOpen && { ml: '24px' }),
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Main>
    </Box>
  );
}
