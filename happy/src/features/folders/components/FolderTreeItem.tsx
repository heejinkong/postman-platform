import { TreeItem } from '@mui/x-tree-view/TreeItem'
import RequestTreeItem from '../../requests/components/RequestTreeItem'
import { Box, IconButton, Menu } from '@mui/material'
import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import AddRequestMenuItem from '../../requests/components/AddRequestMenuItem'
import AddFolderMenuItem from './AddFolderMenuItem'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import { selectFolderById } from '../foldersSlice'
import { folderItem } from '../folderItem'
import DeleteFolderMenuItem from './DeleteFolderMenuItem'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'

type TreeItemProps = {
  _id: string
}

export default function FolderTreeItem(props: TreeItemProps) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const folder = useAppSelector((state) => selectFolderById(state, props._id))
  if (!folder) {
    return null
  }

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setAnchorElUser(e.currentTarget)
  }
  const handleCloseUserMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    setAnchorElUser(null)
  }

  const handleNav = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    navigate(`/workspaces/${folder.workspaceId}/folders/${folder.id}`)
  }

  const renderChildTree = (item: folderItem) => {
    if (item.folders.length === 0 && item.requests.length === 0) {
      return null
    }
    return [
      item.folders.map((_id) => <FolderTreeItem key={_id} _id={_id} />),
      item.requests.map((_id) => <RequestTreeItem key={_id} _id={_id} />)
    ]
  }

  return (
    <TreeItem
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      nodeId={folder.id}
      label={
        <Box
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
          onClick={(e) => handleNav(e)}
        >
          <FolderOpenIcon fontSize="inherit" />
          <Box sx={{ flexGrow: 1, px: 1 }}>{folder.title}</Box>
          <IconButton
            size="small"
            onClick={(e) => handleOpenUserMenu(e)}
            sx={{ opacity: hover ? 1 : 0 }}
          >
            <MoreVertIcon fontSize="inherit" />
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
            <AddRequestMenuItem parentId={folder.id} handleClose={(e) => handleCloseUserMenu(e)} />
            <AddFolderMenuItem parentId={folder.id} handleClose={(e) => handleCloseUserMenu(e)} />
            <DeleteFolderMenuItem
              folderId={folder.id}
              handleClose={(e) => handleCloseUserMenu(e)}
            />
          </Menu>
        </Box>
      }
    >
      {renderChildTree(folder)}
    </TreeItem>
  )
}
