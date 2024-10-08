import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar'
// import Avatar from '@mui/material/Avatar'
import { useAppDispatch, useAppSelector } from '../../../app/hook';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline'
import { useNavigate } from 'react-router-dom';
import { Box, IconButton, ListItemButton, Pagination, Table, TableBody, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { selectAllWorkspaces } from '../service/workspaceSlice';
import workspaceService from '../service/workspaceService';
import { workspaceItem } from '../domain/workspaceItem';
import { useState } from 'react';
import NewWorkspace from './NewWorkspace';

export default function WorkspaceList() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const allWorkspaces = useAppSelector(selectAllWorkspaces).sort((a, b) => {
    return b.created - a.created;
  });

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = allWorkspaces.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(allWorkspaces.length / rowsPerPage);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleNavWorkspace = (workspaceId: string) => {
    navigate(`/workspaces/${workspaceId}`);
  };

  const handleDeleteClick = (e: { stopPropagation: () => void }, workspace: workspaceItem) => {
    e.stopPropagation();
    dispatch(workspaceService.delete(workspace));
  };

  if (allWorkspaces.length === 0) {
    return (
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Typography variant='h6' textAlign='center' mb='0.5rem' sx={{ fontWeight: 500, fontSize: '20px' }}>
          Workspace does not exist
        </Typography>
        <Typography variant='body2' textAlign='center' mb='32px' sx={{ fontSize: '14px' }}>
          To start your work, try using the 'New Workspace' button at the top.
        </Typography>
        <Box sx={{ mx: 'auto' }}>
          <NewWorkspace />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: '868px',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 새로운 workspace 생성 버튼 */}
      <Box sx={{ padding: '16px 0', display: 'flex', justifyContent: 'flex-end' }}>
        <NewWorkspace />
      </Box>
      <Box sx={{ flexGrow: 0 }}>
        {/* Workspace 목록 표시 */}
        <Table aria-label='a dense table'>
          <TableBody>
            {/* 각 Workspace에 대한 정보 표시 */}
            {currentRows.map((ws) => (
              <Box
                sx={{ borderTop: '1px solid #E0E1E3', height: '60px', display: 'flex', padding: '10px 4px 10px 16px' }}
              >
                {/* workspace 목록 클릭시 해당 workspace로 이동 */}
                <ListItemButton
                  key={ws.id}
                  onClick={() => handleNavWorkspace(ws.id)}
                  sx={{ display: 'flex', padding: 0 }}
                >
                  {/* workspace에 대한 avatar 표시 */}
                  {/* <ListItemAvatar>
                    <Avatar>
                      <PersonOutlineIcon />
                    </Avatar>
                  </ListItemAvatar> */}

                  {/* workspace title과 생성 날짜 표시 */}
                  <ListItemText
                    primary={ws.title}
                    // secondary={new Date(ws.created).toLocaleString()}
                    // sx={{ flexGrow: 1 }}
                    sx={{
                      width: '50%',
                    }}
                  />

                  {/* 아이콘 클릭 시, 해당 workspace 삭제 */}
                  <IconButton
                    edge='end'
                    aria-label='delete'
                    onClick={(e) => handleDeleteClick(e, ws)}
                    href='/'
                    sx={{
                      width: '40px',
                      marginRight: 0,
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemButton>
              </Box>
            ))}
          </TableBody>
        </Table>
      </Box>

      {/* Workspace 목록 Pagination 표시 (리스트 10개로 정렬)*/}
      <Box sx={{ mt: '36px', pt: '12px', pb: 3 }}>
        <Pagination
          count={totalPages}
          shape='rounded'
          page={currentPage}
          onChange={(e, page) => handlePageChange(e, page)}
          sx={{ display: 'flex', justifyContent: 'center' }}
        />
      </Box>
    </Box>
  );
}
