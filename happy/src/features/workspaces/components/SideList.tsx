import * as React from 'react'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarBorder from '@mui/icons-material/StarBorder'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { deleteById, selectAllCollection } from '../../collections/collectionsSlice'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

const settings = ['Run collection', 'Add request', 'Add folder', 'Delete']

export default function SideList() {
  const { workspaceId } = useParams()
  const dispatch = useAppDispatch()
  const [open, setOpen] = React.useState(true)
  const navigate = useNavigate()

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const allCollections = useAppSelector(selectAllCollection)
  const colectionList = allCollections
  .filter((c) => c.parent_id === parseInt(workspaceId ?? ''))
  
  const handleNavCollection = (collectionId: number) => {
    navigate(`/workspaces/${workspaceId}/collections/${collectionId}`)
  }

  const handleListClick = () => {
    setOpen(!open)
  }

  const handleMenuClick = (e: { stopPropagation: () => void },settings: string, collectionId: number) => {
    e.stopPropagation()
    if (settings === 'Delete') {
      console.log('delete')
      dispatch(deleteById(collectionId))
    }
  }

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
      {colectionList
            .map((c) => (
        <ListItemButton key={c.id} onClick={() => handleNavCollection(c.id)}>
          <ListItemText primary={c.title} />
          <Box sx={{ flexGrow: 0 }}>
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <MoreVertIcon />
            </IconButton>
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
              {settings.map((settings) => (
                <MenuItem key={settings} onClick={(e) => handleMenuClick(e, settings, c.id)}>
                  <Typography textAlign="center">{settings}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </ListItemButton>
      ))}

      <ListItemButton onClick={handleListClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Starred" />
          </ListItemButton>
        </List>
      </Collapse>
    </List>
  )
}
