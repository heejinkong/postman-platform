import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Container,
  Typography,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import React, { useEffect, useState } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import { DataGrid, GridColDef, GridEventListener, GridRowId, useGridApiRef } from '@mui/x-data-grid';
import { v4 as uuidv4 } from 'uuid';
import DeleteIcon from '@mui/icons-material/Delete';
import globalsService from './service/globalsService';
import { globalsItem } from './domain/globalsItem';
import { useNavigate, useParams } from 'react-router-dom';
import { selectAllGlobals } from './service/globalsSlice';
import { styled } from '@mui/system';
import CircleIcon from '@mui/icons-material/Circle';

export default function GlobalsPage() {
  const dispatch = useAppDispatch();
  const { workspaceId } = useParams();

  const gloabals = useAppSelector(selectAllGlobals);
  const global = gloabals.find((item) => item.workspaceId === workspaceId);

  const [globalsClone, setGlobalsClone] = React.useState(new globalsItem());

  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const [isChanged, setIsChanged] = React.useState(false);

  useEffect(() => {
    const isDataChanged = () => {
      if (global) {
        return JSON.stringify(global) !== JSON.stringify(globalsClone);
      }
      return false;
    };

    setIsChanged(isDataChanged());
  }, [global, globalsClone]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isChanged) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isChanged]);

  const handleSave = () => {
    dispatch(globalsService.update(globalsClone));
    setIsChanged(false);
  };

  const handleDeletePage = () => {
    dispatch(globalsService.delete(globalsClone));

    navigate(-1);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!global) {
      return;
    }
    setGlobalsClone(global);
  }, [global]);

  const [rowIdHover, setRowIdHover] = useState<GridRowId>(-1);
  const globalsRef = useGridApiRef();
  const handleMouseEnter: GridEventListener<'rowMouseEnter'> = (variables) => {
    setRowIdHover(variables.id);
  };

  const handleMouseLeave: GridEventListener<'rowMouseLeave'> = () => {
    setRowIdHover(-1);
  };

  type Row = {
    id: string;
    _variable: string;
    _initialValue: string;
    _currentValue: string;
  };

  const handleProcessNewRows = (newRow: Row, targetRows: Row[]) => {
    const newRows = [...targetRows];
    const index = newRows.findIndex((row) => row.id === newRow.id);
    newRows[index] = newRow;
    const lastRow = newRows[newRows.length - 1];
    if (lastRow._variable !== '' || lastRow._initialValue !== '' || lastRow._currentValue !== '') {
      newRows.push({ id: uuidv4(), _variable: '', _initialValue: '', _currentValue: '' });
    }
    return newRows;
  };

  const isLastRow = (id: GridRowId) => {
    if (globalsClone.variables.length > 0) {
      return id === globalsClone.variables[globalsClone.variables.length - 1].id;
    }
    return false;
  };

  const deleteRow = (id: GridRowId) => {
    const newRows = [...globalsClone.variables];
    const index = newRows.findIndex((row) => row.id === id);
    newRows.splice(index, 1);
    setGlobalsClone({ ...globalsClone, variables: newRows });
  };

  const editableColumns: GridColDef[] = [
    {
      field: '_variable',
      headerName: 'Variable',
      flex: 1,
      editable: true,
      sortable: false,
    },
    {
      field: '_initialValue',
      headerName: 'Initial Value',
      flex: 1,
      editable: true,
      sortable: false,
    },

    {
      field: '_currentValue',
      headerName: 'Current Value',
      flex: 1,
      editable: true,
      sortable: false,
    },
    {
      field: '_delete',
      headerName: '',
      width: 50,
      editable: false,
      sortable: false,
      renderCell: (variables) => {
        //마지막 row가 아니고, 마우스가 해당 row에 hover 되었을 때, 삭제 버튼 표시
        return rowIdHover === variables.id && !isLastRow(variables.id) ? (
          <IconButton
            onClick={() => {
              deleteRow(variables.id);
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null;
      },
    },
  ];

  useEffect(() => {
    try {
      return globalsRef.current.subscribeEvent('rowMouseEnter', handleMouseEnter);
    } catch {
      /* empty */
    }
  }, [globalsRef]);

  useEffect(() => {
    try {
      return globalsRef.current.subscribeEvent('rowMouseLeave', handleMouseLeave);
    } catch {
      /* empty */
    }
  }, [globalsRef]);

  const NavBarBox = styled(Box)({
    '&.NavBarBox': {
      padding: '12px 16px 0 16px',
      '& nav': {
        height: '22px',
      },
      '& a': {
        fontSize: '14px',
      },
      '& > .NavBarBoxDivider': {
        marginTop: '12px',
      },
    },
  });

  return (
    <Box>
      <NavBarBox className='NavBarBox'>
        Globals
        {isChanged && (
          <CircleIcon
            sx={{
              width: '13px',
              height: '13px',
              marginTop: '7px',
              marginLeft: '5px',
              color: '#1877F2',
            }}
          />
        )}
        <Box className='NavBarBoxDivider'>
          <Divider />
        </Box>
      </NavBarBox>
      <Container sx={{ padding: '0 16px', maxWidth: '100%' }}>
        <Box sx={{ display: 'flex', padding: '16px 0' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant='h6'>Globals</Typography>
            <IconButton onClick={handleClickOpen} sx={{ marginLeft: '2px' }}>
              <DeleteIcon />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
              {/* Dialog의 문구*/}

              <DialogContent sx={{ padding: '16px 24px' }}>
                <Typography variant='h6'>Delete all globals?</Typography>
                <Typography sx={{ marginTop: '24px', fontSize: '16px', fontWeight: 400 }}>
                  This action will delete all global variables.
                </Typography>
                {/* Dialog의 버튼 */}
                <DialogActions sx={{ p: 0, pt: '24px' }}>
                  <Button onClick={handleClose}>Cancel</Button>
                  <Button
                    onClick={handleDeletePage}
                    sx={{ backgroundColor: '#F44336', borderColor: '#F44336 !important', color: '#fff !important' }}
                  >
                    Delete
                  </Button>
                </DialogActions>
              </DialogContent>
            </Dialog>
          </Box>
          {/* EnvironmentPage의 저장버튼 */}
          <Box sx={{ marginLeft: 'auto' }}>
            <Button variant='outlined' startIcon={<SaveIcon />} onClick={handleSave} disabled={!isChanged}>
              Save
            </Button>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'auto', pt: 1 }}>
          <Box sx={{ height: '40%', overflow: 'auto' }}>
            {/* DataGrid를 통해 params 표시 */}
            <DataGrid
              apiRef={globalsRef}
              rows={globalsClone.variables}
              columns={editableColumns}
              editMode='row'
              checkboxSelection
              disableRowSelectionOnClick
              hideFooter
              disableColumnMenu
              rowSelectionModel={globalsClone.variablesSelection} // check 선택한 row 표시
              onRowSelectionModelChange={(newRowSelectionModel) => {
                // check 선택한 row 변경 시, globalsClone에 반영
                setGlobalsClone({
                  ...globalsClone,
                  variablesSelection: newRowSelectionModel as string[],
                });
              }}
              processRowUpdate={(newRow) => {
                // row 수정 시, globalsClone에 반영
                const newRows = handleProcessNewRows(newRow, globalsClone.variables);
                setGlobalsClone({
                  ...globalsClone,
                  variables: newRows,
                  variablesSelection: [...globalsClone.variablesSelection, newRow.id],
                });
                return newRow;
              }}
              onProcessRowUpdateError={(e) => console.log(e)}
              /* DataGrid 반응형 조절 */
              sx={{
                width: '99.9%',
                borderBottom: 0,
                '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                  borderRight: `1px solid rgba(195, 198, 201, 1)`,
                },
                '& .MuiDataGrid-columnHeader:last-of-type': {
                  borderRight: 0,
                },
                '& .MuiDataGrid-cell': {
                  borderRight: '0',
                },
                '& .MuiDataGrid-cellCheckbox': {
                  borderRight: '1px solid rgba(195, 198, 201, 1)',
                },
                '& .MuiDataGrid-cell:has(.MuiDataGrid-cellContent)': {
                  borderRight: '1px solid rgba(195, 198, 201, 1)',
                },
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
