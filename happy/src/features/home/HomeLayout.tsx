import { useEffect, useRef, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography
} from '@mui/material'
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions'

const settings = ['Profile', 'Account', 'Dashboard', 'Logout']

export default function HomeLayout() {
  const headerRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const headerBarRef = useRef<HTMLDivElement>(null)

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

  const navigate = useNavigate()
  const handleOpenWorkspaces = () => {
    navigate('/')
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
      <Box ref={headerRef}>
        <AppBar
          position="fixed"
          ref={headerBarRef}
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Box sx={{ mx: 2 }}>
            <Toolbar disableGutters>
              <EmojiEmotionsIcon sx={{ display: 'flex', mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2,
                  display: 'flex',
                  fontWeight: 700,
                  color: 'inherit',
                  textDecoration: 'none'
                }}
              >
                HAPPY
              </Typography>

              <Box sx={{ flexGrow: 1, display: 'flex' }}>
                <Button
                  sx={{ my: 2, color: 'white', display: 'block' }}
                  onClick={handleOpenWorkspaces}
                >
                  Workspace
                </Button>
              </Box>

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
      <Box ref={bodyRef}>
        <Outlet />
      </Box>
    </Box>
  )
}
