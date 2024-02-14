import { TreeItem } from '@mui/x-tree-view/TreeItem';
import RequestTreeItem from '../../requests/components/RequestTreeItem';
import { Box, IconButton, Menu } from '@mui/material';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddRequestMenuItem from '../../requests/components/AddRequestMenuItem';
import AddFolderMenuItem from './AddFolderMenuItem';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../../app/hook';
import { selectFolderById } from '../service/folderSlice';
import { folderItem } from '../domain/folderItem';
import DeleteFolderMenuItem from './DeleteFolderMenuItem';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import RunFolderMenuItem from './RunFolderMenuItem';

type TreeItemProps = {
  _id: string;
};

export default function FolderTreeItem(props: TreeItemProps) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const folder = useAppSelector((state) => selectFolderById(state, props._id));
  if (!folder) {
    return null;
  }

  const handleOpenUserMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorElUser(e.currentTarget);
  };
  const handleCloseUserMenu = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setAnchorElUser(null);
  };

  const handleNav = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    navigate(`/workspaces/${folder.workspaceId}/folders/${folder.id}`);
  };

  const renderChildTree = (item: folderItem) => {
    if (item.folders.length === 0 && item.requests.length === 0) {
      return null;
    }
    return [
      item.folders.map((_id) => <FolderTreeItem key={_id} _id={_id} />),
      item.requests.map((_id) => <RequestTreeItem key={_id} _id={_id} />),
    ];
  };

  return (
    /* Sidebar에 TreeItem 기능을 사용하여 folder 표시 */
    <TreeItem
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      nodeId={folder.id}
      /* label에 folder title 표시하고, label 클릭시 해당 folder로 이동 */
      label={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '14px',
            height: '32px',
          }}
          onClick={(e) => handleNav(e)}
        >
          <FolderOpenIcon sx={{ fontSize: '18px' }} />
          <Box sx={{ flexGrow: 1, marginLeft: '4px' }}>{folder.title}</Box>
          <IconButton size='small' onClick={(e) => handleOpenUserMenu(e)} sx={{ opacity: hover ? 1 : 0 }}>
            <MoreVertIcon fontSize='inherit' />
          </IconButton>
          {/* folder label에 마우스 호버 시, 메뉴가 나타나도록 설정 */}
          <Menu
            sx={{ mt: '45px' }}
            id='menu-appbar'
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {/* 메뉴 오픈시, folder에 대한 기능을 수행할 수 있는 menuitem 설정 */}
            <RunFolderMenuItem parentId={folder.id} handleClose={(e) => handleCloseUserMenu(e)} />
            <AddRequestMenuItem parentId={folder.id} handleClose={(e) => handleCloseUserMenu(e)} />
            <AddFolderMenuItem parentId={folder.id} handleClose={(e) => handleCloseUserMenu(e)} />
            <DeleteFolderMenuItem folderId={folder.id} handleClose={(e) => handleCloseUserMenu(e)} />
          </Menu>
        </Box>
      }
    >
      {/* folder의 하위 요소(folder, request)들을 표시 */}
      {renderChildTree(folder)}
    </TreeItem>
  );
}
