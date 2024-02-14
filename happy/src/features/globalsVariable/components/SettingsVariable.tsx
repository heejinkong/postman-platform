import { Box, Button, Dialog, DialogContent, DialogTitle, Divider, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { globalsItem } from '../domain/globalsItem';
import globalsService from '../service/globalsService';
import { DataGrid, GridColDef, GridEventListener, GridRowId, useGridApiRef } from '@mui/x-data-grid';
import { selectAllGlobals } from '../service/globalsSlice';

export default function SettingsVariable() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const dispatch = useAppDispatch();

  const gloabals = useAppSelector(selectAllGlobals);
  const global = gloabals.find((item) => item.workspaceId === workspaceId);

  const [globalsClone, setGlobalsClone] = React.useState(new globalsItem());

  const variablesSelection = globalsClone.variablesSelection;

  const variables = globalsClone.variables.filter((variable) => variablesSelection.includes(variable.id));

  useEffect(() => {
    if (!global) {
      return;
    }
    setGlobalsClone(global);
  }, [global]);

  const [rowIdHover, setRowIdHover] = useState<GridRowId>(-1);
  const globalsRef = useGridApiRef();

  console.log('rowIdHover', rowIdHover);

  const handleMouseEnter: GridEventListener<'rowMouseEnter'> = (variables) => {
    setRowIdHover(variables.id);
  };
  const handleMouseLeave: GridEventListener<'rowMouseLeave'> = () => {
    setRowIdHover(-1);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddGlobals = () => {
    const newItem = new globalsItem();
    newItem.title = 'Globals';
    newItem.workspaceId = workspaceId ?? '';

    dispatch(globalsService.new(newItem));

    navigate(`/workspaces/${workspaceId}/globals`);
    setOpen(false);
  };

  const handleEditGlobals = () => {
    navigate(`/workspaces/${workspaceId}/globals`);
    setOpen(false);
  };

  const readOnlyColumns: GridColDef[] = [
    {
      field: '_variable',
      headerName: 'Variable',
      flex: 1,
      editable: false,
      sortable: false,
    },
    {
      field: '_initialValue',
      headerName: 'Initial Value',
      flex: 1,
      editable: false,
      sortable: false,
    },

    {
      field: '_currentValue',
      headerName: 'Current Value',
      flex: 1,
      editable: false,
      sortable: false,
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

  return (
    <Box>
      {/* BuildIcon 버튼 클릭 시, Dialog 노출 */}
      <MenuItem>
        <Typography textAlign='center' onClick={handleClickOpen}>
          Environment
        </Typography>
      </MenuItem>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='alert-dialog-title'
        sx={{
          '& .MuiDialog-paper': {
            maxWidth: '1280px',
            height: '601px',
          },
        }}
      >
        {/* Global variables */}
        <Box>
          {/*Global variables가 있을 경우, 해당 global variables를 뿌려줌 */}
          {variablesSelection.length > 0 ? (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 2,
                }}
              >
                <DialogTitle
                  sx={{
                    padding: '16px',
                    '& h6': {
                      mb: 0,
                    },
                  }}
                >
                  Globals
                </DialogTitle>
              </Box>
              <DialogContent
                sx={{
                  padding: '16px',
                }}
              >
                <Box sx={{ maxHeight: 436, overflowY: 'auto' }}>
                  {/* DataGrid를 통해 params 표시 */}
                  <DataGrid
                    apiRef={globalsRef}
                    rows={variables}
                    columns={readOnlyColumns}
                    editMode='row'
                    disableRowSelectionOnClick
                    hideFooter
                    disableColumnMenu
                    /* DataGrid 반응형 조절 */
                    sx={{
                      width: '99.9%',
                      borderBottom: 0,
                      borderRight: 0,
                      '& .MuiDataGrid-columnHeader, .MuiDataGrid-cell': {
                        borderRight: `1px solid rgba(224, 224, 224, 1)`,
                      },
                      '& .MuiDataGrid-cell': {
                        borderRight: '0',
                      },
                      '& .MuiDataGrid-cell:has(.MuiDataGrid-cellContent)': {
                        borderRight: '1px solid rgba(224, 224, 224, 1)',
                      },
                      '& .MuiDataGrid-cell + .MuiDataGrid-cellContent': {
                        borderRight: '1px solid red',
                      },
                    }}
                  />
                </Box>
              </DialogContent>
              <Box>
                <Divider />
              </Box>
              <Box sx={{ p: '16px', textAlign: 'right' }}>
                <Button
                  sx={{ padding: '8px 22px', fontSize: '15px !important', marginRight: '16px' }}
                  onClick={handleClose}
                  className='btnWhite'
                >
                  Cancle
                </Button>
                <Button
                  sx={{ padding: '8px 22px', fontSize: '15px !important' }}
                  onClick={handleEditGlobals}
                  className='btnBlue'
                >
                  Edit
                </Button>
              </Box>
            </Box>
          ) : (
            /*Global variables가 없을 경우, Global variables를 추가할 수 있는 버튼을 뿌려줌 */
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 2,
                }}
              >
                <DialogTitle>Globals</DialogTitle>
              </Box>
              <DialogContent
                sx={{
                  padding: 0,
                  height: '468px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                }}
              >
                <Box sx={{}}>
                  <Typography
                    variant='subtitle2'
                    sx={{
                      fontSize: '20px',
                      fontWeight: 500,
                    }}
                  >
                    No global variables
                  </Typography>
                  <Typography
                    variant='caption'
                    display='block'
                    sx={{ color: 'rgba(0, 0, 0, 0.60)', fontSize: '14px', maxWidth: '520px', marginTop: 1, mb: 3 }}
                  >
                    Global variables are a set of variables that are always available in a workspace. Click the "Add"
                    button below to specify a global variable.
                  </Typography>
                </Box>
                <Box>
                  <Button className='btnBlue' onClick={handleAddGlobals}>
                    Add
                  </Button>
                </Box>
              </DialogContent>
              <Box
                sx={{
                  display: 'flex',
                  alignContent: 'center',
                  justifyContent: 'flex-end',
                  borderTop: '1px solid rgba(195, 198, 201, 1)',
                }}
              >
                <Button variant='text' sx={{ margin: '16px' }} onClick={handleClose}>
                  Close
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  );
}
