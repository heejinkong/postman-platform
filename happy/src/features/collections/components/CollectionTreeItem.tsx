import { TreeItem } from '@mui/x-tree-view/TreeItem'
import RequestTreeItem from '../../requests/components/RequestTreeItem'
import FolderTreeItem from '../../folders/components/FolderTreeItem'
import { Box, IconButton, Menu } from '@mui/material'
import AddRequestMenuItem from '../../requests/components/AddRequestMenuItem'
import AddFolderMenuItem from '../../folders/components/AddFolderMenuItem'
import DeleteCollectionMenuItem from './DeleteCollectionMenuItem'
import { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import { selectCollectionById } from '../collectionsSlice'
import { collectionItem } from '../collectionItem'
import RunCollectionMenuItem from './RuncollectionMenuItem'

type TreeItemProps = {
  _id: string
}

export default function CollectionTreeItem(props: TreeItemProps) {
  const navigate = useNavigate()
  const [hover, setHover] = useState(false)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const collection = useAppSelector((state) => selectCollectionById(state, props._id))
  if (!collection) {
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
    navigate(`/workspaces/${collection.workspaceId}/collections/${collection.id}`)
  }

  const renderChildTree = (item: collectionItem) => {
    if (item.folders.length === 0 && item.requests.length === 0) {
      return null
    }
    return [
      item.folders.map((_id) => <FolderTreeItem key={_id} _id={_id} />),
      item.requests.map((_id) => <RequestTreeItem key={_id} _id={_id} />)
    ]
  }

  return (
    <Box>
      <TreeItem
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        nodeId={collection.id}
        label={
          <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={(e) => handleNav(e)}>
            <Box sx={{ flexGrow: 1 }}>{collection.title}</Box>
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
              {/* <RunCollectionMenuItem
                collectionId={collection.id}
                handleClose={(e) => handleCloseUserMenu(e)}
              /> */}
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
        }
      >
        {renderChildTree(collection)}
      </TreeItem>
    </Box>
  )
}
