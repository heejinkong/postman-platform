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
import { useAppSelector } from '../../../app/hook'
import { selectAllCollection } from '../../collections/collectionsSlice'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'

// const options = ['Run collection', 'Add request', 'Add folder', 'Delete']
// const ITEM_HEIGHT = 48

export default function SideList() {
  const [open, setOpen] = React.useState(true)
  const navigate = useNavigate()

  // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  // const menuOpen = Boolean(anchorEl)

  const allCollections = useAppSelector(selectAllCollection)
  const { workspaceId } = useParams()

  const handleNavCollection = (collectionId: number) => {
    navigate(`/workspaces/${workspaceId}/collections/${collectionId}`)
  }

  const handleListClick = () => {
    setOpen(!open)
  }

  // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
  //   setAnchorEl(event.currentTarget)
  // }
  // const handleClose = () => {
  //   setAnchorEl(null)
  // }

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
      {allCollections.map((c) => (
        <ListItemButton key={c.id} onClick={() => handleNavCollection(c.id)}>
          <ListItemText primary={c.title} />
          {/* <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={menuOpen ? 'long-menu' : undefined}
            aria-expanded={menuOpen ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'long-button'
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: '20ch'
              }
            }}
          >
            {options.map((option) => (
              <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose}>
                {option}
              </MenuItem>
            ))}
          </Menu> */}
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
