import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from '@mui/material'
import BuildIcon from '@mui/icons-material/Build'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { environmentItem } from '../../variables/domain/environmentItem'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import environmentService from '../../variables/service/environmentService'
import { selectAllEnvironments } from '../../variables/service/environmentSlice'
import { selectRequestById } from '../service/requestSlice'
import { globalsItem } from '../../globalsVariable/domain/globalsItem'
import globalsService from '../../globalsVariable/service/globalsService'
import { selectWorkspaceById } from '../../workspaces/service/workspaceSlice'
import { DataGrid, GridColDef, GridEventListener, GridRowId, useGridApiRef } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'
import { selectAllGlobals } from '../../globalsVariable/service/globalsSlice'

type SettingsVariableProps = {
  _id: string
}
export default function SettingsVariable(props: SettingsVariableProps) {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  const { requestId } = useParams()

  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))
  const workspaceGlobalId = workspace?.globalsId

  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))
  const requestEnvironmentId = request.environmentId

  const dispatch = useAppDispatch()

  const environments = useAppSelector(selectAllEnvironments)
  const environment = environments.find((item) => item.parentId === props._id)

  const gloabals = useAppSelector(selectAllGlobals)
  const global = gloabals.find((item) => item.workspaceId === workspaceId)

  const [globalsClone, setGlobalsClone] = React.useState(new globalsItem())
  const [environmentClone, setEnvironmentClone] = React.useState(new environmentItem())

  useEffect(() => {
    if (!environment) {
      return
    }
    setEnvironmentClone(environment)
  }, [environment])

  useEffect(() => {
    if (!global) {
      return
    }
    setGlobalsClone(global)
  }, [global])

  const [rowIdHover, setRowIdHover] = useState<GridRowId>(-1)
  const globalsRef = useGridApiRef()
  const environmentRef = useGridApiRef()

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

  const handleAddEnvironment = () => {
    const newItem = new environmentItem()
    newItem.title = 'New Environment'
    newItem.workspaceId = workspaceId ?? ''
    newItem.parentId = props._id
    dispatch(environmentService.new(newItem))

    navigate(`/workspaces/${workspaceId}/environments/${newItem.id}`)
  }

  const handleEditEnvironment = () => {
    navigate(`/workspaces/${workspaceId}/environments/${requestEnvironmentId}`)
  }

  const handleAddGlobals = () => {
    const newItem = new globalsItem()
    newItem.title = 'Globals'
    newItem.workspaceId = workspaceId ?? ''

    dispatch(globalsService.new(newItem))

    navigate(`/workspaces/${workspaceId}/globals`)
  }

  const handleEditGlobals = () => {
    navigate(`/workspaces/${workspaceId}/globals`)
  }

  type Row = {
    id: string
    _variable: string
    _initialValue: string
    _currentValue: string
  }

  const handleProcessNewRows = (newRow: Row, targetRows: Row[]) => {
    const newRows = [...targetRows]
    const index = newRows.findIndex((row) => row.id === newRow.id)
    newRows[index] = newRow
    const lastRow = newRows[newRows.length - 1]
    if (lastRow._variable !== '' || lastRow._initialValue !== '' || lastRow._currentValue !== '') {
      newRows.push({ id: uuidv4(), _variable: '', _initialValue: '', _currentValue: '' })
    }
    return newRows
  }

  const editableColumns: GridColDef[] = [
    {
      field: '_variable',
      headerName: 'Variable',
      flex: 1,
      editable: true,
      sortable: false
    },
    {
      field: '_initialValue',
      headerName: 'Initial Value',
      flex: 1,
      editable: true,
      sortable: false
    },

    {
      field: '_currentValue',
      headerName: 'Current Value',
      flex: 1,
      editable: true,
      sortable: false
    }
  ]

  useEffect(() => {
    try {
      return environmentRef.current.subscribeEvent('rowMouseEnter', handleMouseEnter)
    } catch {
      /* empty */
    }
  }, [environmentRef])

  useEffect(() => {
    try {
      return environmentRef.current.subscribeEvent('rowMouseLeave', handleMouseEnter)
    } catch {
      /* empty */
    }
  }, [environmentRef])

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
      <IconButton sx={{ pr: 5 }} size="small" aria-label="settings" onClick={handleClickOpen}>
        <BuildIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
        <Box sx={{ width: 600, height: 250 }}>
          {/* Environment variables가 있을 경우, 해당 Environment variables를 뿌려줌 */}
          {requestEnvironmentId.length > 0 ? (
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
                    {environment?.title}
                  </Typography>
                </DialogTitle>
                <Button variant="text" onClick={handleEditEnvironment}>
                  Edit
                </Button>
              </Box>
              <DialogContent>
                <Box sx={{ maxHeight: 140, overflowY: 'auto' }}>
                  {/* DataGrid를 통해 params 표시 */}
                  <DataGrid
                    apiRef={environmentRef}
                    rows={environmentClone.variables}
                    columns={editableColumns}
                    editMode="row"
                    disableRowSelectionOnClick
                    hideFooter
                    disableColumnMenu
                    processRowUpdate={(newRow) => {
                      // row 수정 시, environmentClone에 반영
                      const newRows = handleProcessNewRows(newRow, environmentClone.variables)
                      setEnvironmentClone({ ...environmentClone, variables: newRows })
                      return newRow
                    }}
                    onProcessRowUpdateError={(e) => console.log(e)}
                  />
                </Box>
              </DialogContent>
            </Box>
          ) : (
            /*Environment variables가 없을 경우, Environment variables를 추가할 수 있는 버튼을 뿌려줌 */
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
                    Environment
                  </Typography>
                </DialogTitle>
                <Button variant="text" onClick={handleAddEnvironment}>
                  Add
                </Button>
              </Box>
              <DialogContent>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 5, ml: 3 }}>
                    No Environment variables
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom sx={{ mt: 1, ml: 2 }}>
                    An environment is a set of variables that allow you to switch the context of
                    your requests.
                  </Typography>
                </Box>
              </DialogContent>
            </Box>
          )}
        </Box>

        <Divider />
        {/* Global variables */}
        <Box sx={{ width: 600, height: 250 }}>
          {/*Global variables가 있을 경우, 해당 global variables를 뿌려줌 */}
          {workspaceGlobalId.length > 0 ? (
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
                <Box sx={{ maxHeight: 140, overflowY: 'auto' }}>
                  {/* DataGrid를 통해 params 표시 */}
                  <DataGrid
                    apiRef={globalsRef}
                    rows={globalsClone.variables}
                    columns={editableColumns}
                    editMode="row"
                    disableRowSelectionOnClick
                    hideFooter
                    disableColumnMenu
                    processRowUpdate={(newRow) => {
                      // row 수정 시, environmentClone에 반영
                      const newRows = handleProcessNewRows(newRow, globalsClone.variables)
                      setGlobalsClone({ ...globalsClone, variables: newRows })
                      return newRow
                    }}
                    onProcessRowUpdateError={(e) => console.log(e)}
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
