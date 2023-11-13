import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import { selectCollectionById } from '../collectionsSlice'
import { useAppSelector } from '../../../app/hook'
import RequestsList from '../../requests/components/RequestsList'
import FoldersList from '../../folders/components/FoldersList'
import AddRequestMenuItem from '../../requests/components/AddRequestMenuItem'
import DeleteCollectionMenuItem from './DeleteCollectionMenuItem'
import AddFolderMenuItem from '../../folders/components/AddFolderMenuItem'

type CollectionListItemProps = {
  collectionId: string
}

export default function CollectionsListItem(props: CollectionListItemProps) {
  const navigate = useNavigate()
  const [hover, setHover] = React.useState(false)
  const [open, setOpen] = React.useState(true)

  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))
  if (!collection) {
    navigate('/NotFoundPage')
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    navigate(`/workspaces/${collection.workspaceId}/collections/${collection.id}`)
  }
  const handleExpand = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    setOpen(!open)
  }

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchorElUser(e.currentTarget)
  }
  const handleCloseUserMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    setAnchorElUser(null)
  }

  return (
    <Box>
      <ListItemButton
        key={collection.id}
        onClick={(e) => handleClick(e)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          pl: 2
        }}
        dense
      >
        <ListItemText primary={collection.title} />
        <IconButton onClick={(e) => handleExpand(e)}>
          {collection.requests.length === 0 && collection.folders.length === 0 ? null : open ? (
            <ExpandLess />
          ) : (
            <ExpandMore />
          )}
        </IconButton>
        <Box sx={{ flexGrow: 0 }}>
          <IconButton onClick={(e) => handleOpenUserMenu(e)} sx={{ opacity: hover ? 1 : 0 }}>
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
            <AddRequestMenuItem
              parentId={collection.id}
              handleClose={(e) => handleCloseUserMenu(e)}
            />
            <AddFolderMenuItem
              parentId={collection.id}
              handleClose={(e) => handleCloseUserMenu(e)}
            />
            <DeleteCollectionMenuItem
              collectionId={collection.id}
              handleClose={(e) => handleCloseUserMenu(e)}
            />
          </Menu>
        </Box>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <FoldersList folders={collection.folders} />
        <RequestsList requests={collection.requests} />
      </Collapse>
    </Box>
  )
}
