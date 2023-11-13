import { Box } from '@mui/joy'
import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import Menu from '@mui/material/Menu'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import React from 'react'
import { selectCollectionById } from '../../collections/collectionsSlice'
import { selectFolderById } from '../foldersSlice'
import { Collapse } from '@mui/material'
import FoldersList from './FoldersList'
import RequestsList from '../../requests/components/RequestsList'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import AddRequestMenuItem from '../../requests/components/AddRequestMenuItem'
import AddFolderMenuItem from './AddFolderMenuItem'
import DeleteFolderMenuItem from './DeleteFolderMenuItem'

type folderItemProps = {
  folderId: string
}

export default function FoldersListItem(props: folderItemProps) {
  const navigate = useNavigate()

  const folder = useAppSelector((state) => selectFolderById(state, props.folderId))
  const collection = useAppSelector((state) => selectCollectionById(state, folder?.parentId ?? ''))

  const [hover, setHover] = React.useState(false)
  const [open, setOpen] = React.useState(true)
  const handleNavFolder = () => {
    navigate(`/workspaces/${collection.workspaceId}/folders/${folder.id}`)
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

  if (folder) {
    return (
      <Box>
        <ListItemButton
          key={folder.id}
          onClick={() => handleNavFolder()}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          sx={{ pl: 4 }}
          dense
        >
          <FolderOpenIcon />
          <ListItemText primary={folder?.title} />
          <IconButton onClick={(e) => handleExpand(e)}>
            {folder.requests.length === 0 && folder.folders.length === 0 ? null : open ? (
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
                parentId={folder.id}
                handleClose={(e) => handleCloseUserMenu(e)}
              />
              <AddFolderMenuItem parentId={folder.id} handleClose={(e) => handleCloseUserMenu(e)} />
              <DeleteFolderMenuItem
                folderId={folder.id}
                handleClose={(e) => handleCloseUserMenu(e)}
              />
            </Menu>
          </Box>
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit sx={{ ml: 4 }}>
          <FoldersList folders={folder.folders} />
          <RequestsList requests={folder.requests} />
        </Collapse>
      </Box>
    )
  } else {
    return <></>
  }
}
