import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Typography
} from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import React, { useEffect, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { DataGrid, GridColDef, GridEventListener, GridRowId, useGridApiRef } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'
import DeleteIcon from '@mui/icons-material/Delete'
import globalsService from './service/globalsService'
import { globalsItem } from './domain/globalsItem'
import { useNavigate, useParams } from 'react-router-dom'
import { selectAllGlobals } from './service/globalsSlice'

export default function GlobalsPage() {
  const dispatch = useAppDispatch()
  const { workspaceId } = useParams()

  const gloabals = useAppSelector(selectAllGlobals)
  const global = gloabals.find((item) => item.workspaceId === workspaceId)

  const [globalsClone, setGlobalsClone] = React.useState(new globalsItem())

  const navigate = useNavigate()

  const [open, setOpen] = React.useState(false)

  const handleSave = () => {
    dispatch(globalsService.update(globalsClone))
  }

  const handleDeletePage = () => {
    dispatch(globalsService.delete(globalsClone))

    navigate(-1)
  }

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

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

  const isLastRow = (id: GridRowId) => {
    if (globalsClone.variables.length > 0) {
      return id === globalsClone.variables[globalsClone.variables.length - 1].id
    }
    return false
  }

  const deleteRow = (id: GridRowId) => {
    const newRows = [...globalsClone.variables]
    const index = newRows.findIndex((row) => row.id === id)
    newRows.splice(index, 1)
    setGlobalsClone({ ...globalsClone, variables: newRows })
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
              deleteRow(variables.id)
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null
      }
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
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Box sx={{ pt: 1 }}>
          Globals
          {/* <IconButton onClick={handleDeletePage}>
            <DeleteIcon />
          </IconButton> */}
          <IconButton onClick={handleClickOpen}>
            <DeleteIcon />
          </IconButton>
          <Dialog open={open} onClose={handleClose}>
            {/* Dialog의 문구*/}

            <DialogContent>
              <Typography variant="h6" gutterBottom>
                삭제하시겠습니까 ?
              </Typography>
            </DialogContent>

            {/* Dialog의 버튼 */}
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleDeletePage}>Delete</Button>
            </DialogActions>
          </Dialog>
          <Divider />
        </Box>
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Globals
            </Typography>
          </Box>
          {/* EnvironmentPage의 저장버튼 */}
          <Box>
            <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
        <Box sx={{ flexGrow: 1, overflow: 'auto', pt: 2 }}>
          <Box sx={{ height: '40%', overflow: 'auto' }}>
            {/* DataGrid를 통해 params 표시 */}
            <DataGrid
              apiRef={globalsRef}
              rows={globalsClone.variables}
              columns={editableColumns}
              editMode="row"
              checkboxSelection
              disableRowSelectionOnClick
              hideFooter
              disableColumnMenu
              rowSelectionModel={globalsClone.variablesSelection} // check 선택한 row 표시
              onRowSelectionModelChange={(newRowSelectionModel) => {
                // check 선택한 row 변경 시, globalsClone에 반영
                setGlobalsClone({
                  ...globalsClone,
                  variablesSelection: newRowSelectionModel as string[]
                })
              }}
              processRowUpdate={(newRow) => {
                // row 수정 시, globalsClone에 반영
                const newRows = handleProcessNewRows(newRow, globalsClone.variables)
                setGlobalsClone({ ...globalsClone, variables: newRows })
                return newRow
              }}
              onProcessRowUpdateError={(e) => console.log(e)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
