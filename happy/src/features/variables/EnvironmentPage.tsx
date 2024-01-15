import { Box, Button, Divider, IconButton, TextField } from '@mui/material'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { selectEnvironmentById } from './service/environmentSlice'
import React, { useEffect, useState } from 'react'
import { environmentItem } from './domain/environmentEntity'
import SaveIcon from '@mui/icons-material/Save'
import environmentService from './service/environmentService'
import { DataGrid, GridColDef, GridEventListener, GridRowId, useGridApiRef } from '@mui/x-data-grid'
import { v4 as uuidv4 } from 'uuid'
import DeleteIcon from '@mui/icons-material/Delete'

export default function EnvironmentPage() {
  const dispatch = useAppDispatch()
  const { environmentId } = useParams()
  const environment = useAppSelector((state) => selectEnvironmentById(state, environmentId ?? ''))

  const [environmentClone, setEnvironmentClone] = React.useState(new environmentItem())
  const [title, setTitle] = useState('')

  const handleSave = () => {
    const cloned = JSON.parse(JSON.stringify(environmentClone))
    cloned.title = title
    dispatch(environmentService.update(environmentClone))
  }

  useEffect(() => {
    if (!environment) {
      return
    }
    setEnvironmentClone(environment)
    setTitle(environment.title)
  }, [environment])

  const [rowIdHover, setRowIdHover] = useState<GridRowId>(-1)
  const environmentRef = useGridApiRef()

  const handleMouseEnter: GridEventListener<'rowMouseEnter'> = (variables) => {
    setRowIdHover(variables.id)
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
    if (environmentClone.variables.length > 0) {
      return id === environmentClone.variables[environmentClone.variables.length - 1].id
    }
    return false
  }

  const deleteRow = (id: GridRowId) => {
    const newRows = [...environmentClone.variables]
    const index = newRows.findIndex((row) => row.id === id)
    newRows.splice(index, 1)
    setEnvironmentClone({ ...environmentClone, variables: newRows })
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
      return environmentRef.current.subscribeEvent('rowMouseEnter', handleMouseEnter)
    } catch {
      /* empty */
    }
  }, [environmentRef])

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Box sx={{ pt: 1 }}>
          {environment?.title}
          <Divider />
        </Box>
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* EnvironmentPage의 title */}
          <Box>
            <TextField
              id="outlined-basic"
              label="environment title"
              variant="outlined"
              size="small"
              value={environmentClone.title}
              onChange={(e) => {
                setEnvironmentClone({ ...environmentClone, title: e.target.value as string })
              }}
            />
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
              apiRef={environmentRef}
              rows={environmentClone.variables}
              columns={editableColumns}
              editMode="row"
              checkboxSelection
              disableRowSelectionOnClick
              hideFooter
              disableColumnMenu
              rowSelectionModel={environmentClone.variablesSelection} // check 선택한 row 표시
              onRowSelectionModelChange={(newRowSelectionModel) => {
                // check 선택한 row 변경 시, environmentClone에 반영
                setEnvironmentClone({
                  ...environmentClone,
                  variablesSelection: newRowSelectionModel as string[]
                })
              }}
              processRowUpdate={(newRow) => {
                // row 수정 시, environmentClone에 반영
                const newRows = handleProcessNewRows(newRow, environmentClone.variables)
                setEnvironmentClone({ ...environmentClone, variables: newRows })
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
