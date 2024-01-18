import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  MenuProps,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
  styled
} from '@mui/material'
import React from 'react'
import NewWorkspace from '../workspaces/components/NewWorkspace'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { useAppSelector } from '../../app/hook'
import { selectAllWorkspaces } from '../workspaces/service/workspaceSlice'

const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}))

export default function HomeLayout() {
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const headerBarRef = useRef<HTMLDivElement>(null)

  const navigate = useNavigate()
  const allWorkspaces = useAppSelector(selectAllWorkspaces)

  const handleNavWorkspace = (workspaceId: string) => {
    navigate(`/workspaces/${workspaceId}`)
    setAnchorEl(null)
  }

  const handleResize = () => {
    if (headerRef.current && bodyRef.current && headerBarRef.current) {
      const headerBarHeight = headerBarRef.current.offsetHeight
      headerRef.current.style.height = `${headerBarHeight}px`
      bodyRef.current.style.height = `calc(100vh - ${headerBarHeight}px)`
    }
  }

  useEffect(() => {
    handleResize()
  }, [headerBarRef, bodyRef])

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  return (
    <Box>
      {/* HomeLayout은 Header와 Body로 구성 */}
      <Box ref={headerRef}>
        {/* Header는 AppBar로 구성 */}
        <AppBar
          position="fixed"
          ref={headerBarRef}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 2, backgroundColor: 'background.default' }}
        >
          {/* AppBar는 Toolbar로 구성 */}
          <Box sx={{ mx: 2 }}>
            <Toolbar disableGutters>
              {/* Top Menu */}
              <Avatar
                alt="ToolBal Icon"
                src="/iconTool.jpg"
                sx={{ display: 'flex', ml: 1, mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                letterSpacing="-0.1rem"
                fontWeight="bold"
                color={'primary.main'}
                sx={{
                  mr: 6,
                  textDecoration: 'none'
                }}
              >
                통합문서뷰어
              </Typography>
              {/* AppBar의 WORKSPACE Button 표시 */}
              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <Button
                  id="demo-customized-button"
                  aria-controls={open ? 'demo-customized-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  variant="text"
                  disableElevation
                  onClick={handleClick}
                  endIcon={<KeyboardArrowDownIcon />}
                  sx={{ color: 'text.primary' }}
                >
                  Workpsace
                </Button>

                {/* AppBar의 WORKSPACE Button 클릭 시, 해당 workspace 목록 표시 */}
                <StyledMenu
                  id="demo-customized-menu"
                  MenuListProps={{
                    'aria-labelledby': 'demo-customized-button'
                  }}
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                >
                  <Box>
                    <Box
                      sx={{
                        flexWrap: 'wrap',
                        '& > :not(style)': {
                          m: 1,
                          width: 350,
                          height: 150
                        }
                      }}
                    >
                      {/* workspace가 없을 경우, 해당 문구 표시 */}
                      {allWorkspaces.length === 0 ? (
                        <Box>
                          <Typography
                            variant="button"
                            display="block"
                            gutterBottom
                            sx={{ mt: 5, ml: 3 }}
                          >
                            Workspace does not exist
                          </Typography>
                          <Typography
                            variant="caption"
                            display="block"
                            gutterBottom
                            sx={{ mt: 1, ml: 2 }}
                          >
                            To start your work, try using the 'New Workspace' button at the top.
                          </Typography>
                        </Box>
                      ) : (
                        // workspace가 있을 경우, 해당 workspace 목록 표시
                        <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                          {allWorkspaces.map((ws) => (
                            <MenuItem
                              key={ws.id}
                              onClick={() => handleNavWorkspace(ws.id)}
                              disableRipple
                              sx={{ p: 1, m: 0.5, fontSize: '17px' }}
                            >
                              {ws.title.length > 20 ? `${ws.title.slice(0, 20)}...` : ws.title}
                            </MenuItem>
                          ))}
                        </Box>
                      )}
                    </Box>
                    <Divider sx={{ my: 0.5 }} />

                    {/* workspace를 import하거나, 새로운 workspace를 생성할 수 있는 버튼 */}
                    <Box sx={{ display: 'flex' }}>
                      <Box sx={{ ml: 1 }}>
                        <Button variant="outlined" size="small">
                          Import Workspace
                        </Button>
                      </Box>
                      <Box sx={{ ml: 1, mr: 1 }}>
                        <NewWorkspace />
                      </Box>
                    </Box>
                  </Box>
                </StyledMenu>
              </Box>

              {/* AppBar의 회원 정보 버튼 표시 (임시로 만들어 놓은 버튼) */}
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Remy Sharp" src="/avatar.jpg" />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">{setting}</Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Box>
        </AppBar>
      </Box>

      {/* HomePage 부분 */}
      <Box ref={bodyRef}>
        <Outlet />
      </Box>
    </Box>
  )
}
