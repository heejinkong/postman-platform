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
import { selectAllRequest } from '../../requests/requestsSlice'

const settings = ['Run collection', 'Add request', 'Add folder', 'Delete']

export default function SideList() {
  const { workspaceId, collectionId } = useParams()
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
  const collectionList = allCollections.filter((c) => c.parent_id === parseInt(workspaceId ?? ''))

  //collectionId와 일치하는 request를 가져온다.
  const allRequests = useAppSelector(selectAllRequest)
  const RequestList = allRequests.filter((rq) => rq.parent_id === parseInt(collectionId ?? ''))

  const [clickCollectionId, setClickCollectionId] = React.useState<number | null>(null)

  const handleNavCollection = (collectionId: number) => {
    navigate(`/workspaces/${workspaceId}/collections/${collectionId}`)
    if (collectionId !== clickCollectionId) {
      setClickCollectionId(collectionId)
    }
  }
  const handleNavRequest = (requestId: number) => {
    navigate(`/workspaces/${workspaceId}/collections/${collectionId}/requests/${requestId}`)
  }
  const handleListClick = () => {
    setOpen(!open)
  }

  const handleMenuClick = (
    e: { stopPropagation: () => void },
    settings: string,
    collectionId: number
  ) => {
    e.stopPropagation()

    if (settings === `Add request`) {
      console.log('add request')
      navigate(`/workspaces/${workspaceId}/collections/${collectionId}/requests/:requestId`)
    }
    if (settings === 'Delete') {
      console.log('delete')
      dispatch(deleteById(collectionId))
    }
  }

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
      {collectionList.map((c) => (
        <ListItemButton key={c.id} onClick={() => handleNavCollection(c.id)}>
          <ListItemText primary={c.title} />
          {clickCollectionId === c.id ? <ExpandLess /> : <ExpandMore />}
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
      {collectionList.map((c) => (
        <Box>
          <ListItemButton key={c.id} onClick={() => handleNavCollection(c.id)}>
            <ListItemText primary={c.title} />
            {clickCollectionId === c.id ? <ExpandLess /> : <ExpandMore />}
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, opacity: open ? 1 : 0 }}>
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
          <Collapse in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {RequestList.map((rq) => (
                <ListItemButton sx={{ pl: 4 }} key={rq.id} onClick={() => handleNavRequest(rq.id)}>
                  <ListItemText primary={rq.title} />
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </Box>
      ))}
      {/* <ListItemButton onClick={handleListClick}>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
         {RequestList.map((rq) => (
           <ListItemButton sx={{ pl: 4 }} key={rq.id}>
             <ListItemText primary={rq.title} />
           </ListItemButton>
          ))}
        </List>
      </Collapse> */}
    </List>
  )
}
