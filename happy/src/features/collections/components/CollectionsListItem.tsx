import * as React from 'react'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Collapse from '@mui/material/Collapse'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import { deleteCollectionById, selectCollectionById } from '../collectionsSlice'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import RequestsList from '../../requests/components/RequestsList'
import { selectWorkspaceById, updateWorkspace } from '../../workspaces/workspacesSlice'
import FoldersList from '../../folders/components/FoldersList'

type collectionListItemProps = {
  collectionId: string
}

const settings = ['Run collection', 'Add request', 'Add folder', 'Delete']

export default function CollectionsListItem(props: collectionListItemProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [hover, setHover] = React.useState(false)

  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))
  const workspace = useAppSelector((state) => selectWorkspaceById(state, collection.parentId))

  const [open, setOpen] = React.useState(true)
  const handleClick = () => {
    setOpen(!open)
    navigate(`/workspaces/${collection.parentId}/collections/${collection.id}`)
  }

  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null)
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    setAnchorElUser(event.currentTarget)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  const handleMenuClick = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    settings: string,
    collectionId: string
  ) => {
    e.stopPropagation()

    if (settings === `Add request`) {
      console.log('add request')
      navigate(
        `/workspaces/${collection.parentId}/collections/${collection.id}/requests/:requestId`
      )
    }
    if (settings === `Add folder`) {
      navigate(`/workspaces/${collection.parentId}/collections/${collection.id}/folders/:folderId`)
    }
    if (settings === 'Delete') {
      console.log('delete')

      // TODO : workspace의 collections 배열에서 collectionId를 찾아서 삭제
      const cloned = JSON.parse(JSON.stringify(workspace))
      cloned.collections = cloned.collections.filter((id: string) => id !== collectionId)
      dispatch(updateWorkspace(cloned))

      dispatch(deleteCollectionById(collection.id))
    }
    setAnchorElUser(null)
  }

  return (
    <Box>
      <ListItemButton
        key={collection.id}
        onClick={() => handleClick()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <ListItemText primary={collection.title} />
        {(collection.requests.length || collection.folders.length) === 0 ? (
          ``
        ) : open ? (
          <ExpandLess />
        ) : (
          <ExpandMore />
        )}
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
            {settings.map((settings) => (
              <MenuItem key={settings} onClick={(e) => handleMenuClick(e, settings, collection.id)}>
                <Typography textAlign="center">{settings}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <FoldersList folders={collection.folders} />
      </Collapse>
      {/* <Collapse in={open} timeout="auto" unmountOnExit>
        <RequestsList requests={collection.requests} />
      </Collapse> */}
    </Box>
  )
}
