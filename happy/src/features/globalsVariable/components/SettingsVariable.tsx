import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  Typography
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { globalsItem } from '../domain/globalsItem'
import globalsService from '../service/globalsService'
import { DataGrid, GridColDef, GridEventListener, GridRowId, useGridApiRef } from '@mui/x-data-grid'
import { selectAllGlobals } from '../service/globalsSlice'

export default function SettingsVariable() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  const dispatch = useAppDispatch()

  const gloabals = useAppSelector(selectAllGlobals)
  const global = gloabals.find((item) => item.workspaceId === workspaceId)

  const [globalsClone, setGlobalsClone] = React.useState(new globalsItem())

  const variablesSelection = globalsClone.variablesSelection

  const variables = globalsClone.variables.filter((variable) =>
    variablesSelection.includes(variable.id)
  )

  useEffect(() => {
    if (!global) {
      return
    }
    setGlobalsClone(global)
  }, [global])

  const [rowIdHover, setRowIdHover] = useState<GridRowId>(-1)
  const globalsRef = useGridApiRef()

  const handleMouseEnter: GridEventListener<'rowMouseEnter'> = (variables) => {
    setRowIdHover(variables.id)
  }
  const handleMouseLeave: GridEventListener<'rowMouseLeave'> = () => {
    setRowIdHover(-1)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAddGlobals = () => {
    const newItem = new globalsItem()
    newItem.title = 'Globals'
    newItem.workspaceId = workspaceId ?? ''

    dispatch(globalsService.new(newItem))

    navigate(`/workspaces/${workspaceId}/globals`)
    setOpen(false)
  }

  const handleEditGlobals = () => {
    navigate(`/workspaces/${workspaceId}/globals`)
    setOpen(false)
  }

  const readOnlyColumns: GridColDef[] = [
    {
      field: '_variable',
      headerName: 'Variable',
      flex: 1,
      editable: false,
      sortable: false
    },
    {
      field: '_initialValue',
      headerName: 'Initial Value',
      flex: 1,
      editable: false,
      sortable: false
    },

    {
      field: '_currentValue',
      headerName: 'Current Value',
      flex: 1,
      editable: false,
      sortable: false
    }
  ]

  useEffect(() => {
    try {
      return globalsRef.current.subscribeEvent('rowMouseEnter', handleMouseEnter)
    } catch {
      /* empty */
    }
  }, [globalsRef])

  useEffect(() => {
    try {
      return globalsRef.current.subscribeEvent('rowMouseLeave', handleMouseLeave)
    } catch {
      /* empty */
    }
  }, [globalsRef])

  return (
    <Box>
      {/* BuildIcon 버튼 클릭 시, Dialog 노출 */}
      <MenuItem>
        <Typography textAlign="center" sx={{ ml: 5 }} onClick={handleClickOpen}>
          Environment
        </Typography>
      </MenuItem>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
        {/* Global variables */}
        <Box sx={{ width: 600, height: 500 }}>
          {/*Global variables가 있을 경우, 해당 global variables를 뿌려줌 */}
          {variablesSelection.length > 0 ? (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 2
                }}
              >
                <DialogTitle>
                  <Typography variant="h6" gutterBottom>
                    Globals
                  </Typography>
                </DialogTitle>
                <Button variant="text" onClick={handleEditGlobals}>
                  Edit
                </Button>
              </Box>
              <DialogContent>
                <Box sx={{ maxHeight: 350, overflowY: 'auto' }}>
                  {/* DataGrid를 통해 params 표시 */}
                  <DataGrid
                    apiRef={globalsRef}
                    rows={variables}
                    columns={readOnlyColumns}
                    editMode="row"
                    disableRowSelectionOnClick
                    hideFooter
                    disableColumnMenu
                  />
                </Box>
              </DialogContent>
            </Box>
          ) : (
            /*Global variables가 없을 경우, Global variables를 추가할 수 있는 버튼을 뿌려줌 */
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 2
                }}
              >
                <DialogTitle>
                  <Typography variant="h6" gutterBottom>
                    Globals
                  </Typography>
                </DialogTitle>
                <Button variant="text" onClick={handleAddGlobals}>
                  Add
                </Button>
              </Box>
              <DialogContent>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 5, ml: 3 }}>
                    No global variables
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom sx={{ mt: 1, ml: 2 }}>
                    Global variables are a set of variables that are always available in a
                    workspace.
                  </Typography>
                </Box>
              </DialogContent>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  )
}
