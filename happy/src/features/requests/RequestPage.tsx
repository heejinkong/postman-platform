import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Tab,
  Tabs,
  TextField
} from '@mui/material'
import { useParams } from 'react-router-dom'
import React, { useEffect, useRef, useState } from 'react'
import { Divider } from '@mui/joy'
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'
import SaveIcon from '@mui/icons-material/Save'
import SendIcon from '@mui/icons-material/Send'
import { DataGrid, GridEventListener, GridColDef, useGridApiRef, GridRowId } from '@mui/x-data-grid'
import CodeMirror from '@uiw/react-codemirror'
import CodeMirrorMerge from 'react-codemirror-merge'
import { javascript } from '@codemirror/lang-javascript'
import { html } from '@codemirror/lang-html'
import { json } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { selectRequestById } from './service/requestSlice'
import requestService from './service/requestService'
import { requestItem } from './domain/requestEntity'
import configService from '../config/service/configService'
import DeleteIcon from '@mui/icons-material/Delete'
import { v4 as uuidv4 } from 'uuid'
import { runResultItem } from '../runResults/domain/runResultEntity'
import { runTestItem } from '../runTests/domain/runTestEntity'
import runResultService from '../runResults/service/runResultService'
import runTestService from '../runTests/service/runTestService'

interface ResponseType {
  elapsed?: number
  body?: string
  status?: number
}
interface PayloadType {
  url: string
  method: string
  response?: ResponseType
  title?: string
  expectedResult?: string
}

export default function RequestPage() {
  const { requestId } = useParams()
  const codeBoxRef = useRef<HTMLDivElement>(null)

  const [rowIdHover, setRowIdHover] = useState<GridRowId>(-1)
  const paramsRef = useGridApiRef()
  const headersRef = useGridApiRef()
  const bodyRef = useGridApiRef()

  const handleMouseEnter: GridEventListener<'rowMouseEnter'> = (params) => {
    setRowIdHover(params.id)
  }
  const handleMouseLeave: GridEventListener<'rowMouseLeave'> = () => {
    setRowIdHover(-1)
  }

  const dispatch = useAppDispatch()
  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))
  const [requestClone, setRequestClone] = React.useState(new requestItem())

  const [reqTabIndex, setReqTabIndex] = React.useState(0)
  const handleChangeReqTab = (_event: React.SyntheticEvent, index: number) => {
    setReqTabIndex(index)
  }
  const [resTabIndex, setResTabIndex] = React.useState(0)
  const handleChangeResTab = (_event: React.SyntheticEvent, index: number) => {
    setResTabIndex(index)
  }

  const handleSave = () => {
    dispatch(requestService.update(requestClone))
  }

  const handleSend = async () => {
    // dispatch(requestService.send(requestClone))
    const response = await dispatch(requestService.send(requestClone))
    const resUrl = (response.payload as PayloadType)?.url
    const resMethod = (response.payload as PayloadType)?.method
    const resDuration = (response.payload as PayloadType)?.response?.elapsed
    const resBody = (response.payload as PayloadType)?.response?.body
    const resTitle = (response.payload as PayloadType)?.title
    const resStatus = (response.payload as PayloadType)?.response?.status
    const resExpectedResult = (response.payload as PayloadType)?.expectedResult

    const newRunResult = new runResultItem()
    newRunResult.title = resUrl
    newRunResult.workspaceId = requestClone.workspaceId
    newRunResult.parentId = requestClone.parentId
    newRunResult.method = resMethod
    newRunResult.url = resUrl
    newRunResult.created = Date.now()
    newRunResult.Duration = resDuration ?? 0

    dispatch(runResultService.new(newRunResult))

    const newRunTest = new runTestItem()
    newRunTest.title = resTitle || ''
    newRunTest.parentId = requestClone.parentId
    newRunTest.requestId = requestClone.id
    newRunTest.created = Date.now()
    newRunTest.status = resStatus || 0
    newRunTest.responseResult = resBody || ''
    newRunTest.expectedResult = resExpectedResult || ''
    dispatch(runTestService.new(newRunTest))
    newRunResult.runTestList?.push(newRunTest.id)
  }

  const [selectedBodyType, setSelectedBodyType] = useState('form-data')

  const handleChangeBodyType = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedBodyType(e.target.value)
  }

  const getExtension = (type: string) => {
    if (type === 'JavaScript') {
      return [javascript({ jsx: true })]
    } else if (type === 'JSON') {
      return [json()]
    } else if (type === 'HTML') {
      return [html()]
    } else if (type === 'xml') {
      return [xml()]
    } else {
      return []
    }
  }

  type Row = {
    id: string
    _key: string
    _value: string
    _desc: string
  }
  const handleProcessNewRows = (newRow: Row, targetRows: Row[]) => {
    const newRows = [...targetRows]
    const index = newRows.findIndex((row) => row.id === newRow.id)
    newRows[index] = newRow
    const lastRow = newRows[newRows.length - 1]
    if (lastRow._key !== '' || lastRow._value !== '' || lastRow._desc !== '') {
      newRows.push({ id: uuidv4(), _key: '', _value: '', _desc: '' })
    }
    return newRows
  }

  const isLastRow = (id: GridRowId) => {
    if (reqTabIndex === 0) {
      return id === requestClone.params[requestClone.params.length - 1].id
    } else if (reqTabIndex === 1) {
      return id === requestClone.headers[requestClone.headers.length - 1].id
    } else {
      return false
    }
  }

  const deleteRow = (id: GridRowId) => {
    if (reqTabIndex === 0) {
      const newRows = [...requestClone.params]
      const index = newRows.findIndex((row) => row.id === id)
      newRows.splice(index, 1)
      setRequestClone({ ...requestClone, params: newRows })
    } else if (reqTabIndex === 1) {
      const newRows = [...requestClone.headers]
      const index = newRows.findIndex((row) => row.id === id)
      newRows.splice(index, 1)
      setRequestClone({ ...requestClone, headers: newRows })
    }
  }

  const editableColumns: GridColDef[] = [
    {
      field: '_key',
      headerName: 'Key',
      flex: 1,
      editable: true,
      sortable: false
    },
    {
      field: '_value',
      headerName: 'Value',
      flex: 1,
      editable: true,
      sortable: false
    },
    {
      field: '_desc',
      headerName: 'Description',
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
      renderCell: (params) => {
        return rowIdHover === params.id && !isLastRow(params.id) ? (
          <IconButton
            onClick={() => {
              deleteRow(params.id)
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null
      }
    }
  ]

  // const [selectedFormType, setSelectedFormType] = useState(requestClone.body.formData)

  // const handleChangeFormType = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setSelectedFormType(e.target.value)
  // }

  const editableBodyColumns: GridColDef[] = [
    {
      field: '_key',
      headerName: 'Key',
      flex: 1,
      editable: true,
      sortable: false,
      renderCell: () => {
        return (
          <Box>
            <FormControl sx={{ py: 0.5, minWidth: '8rem', pl: 36 }} size="small">
              <Select
                sx={{ height: '1.5rem', width: `5rem`, fontSize: '0.9rem' }}
                // value={selectedFormType}
                // onChange={handleChangeFormType}
              >
                <MenuItem value={'Text'}>Text</MenuItem>
                <MenuItem value={'File'}>File</MenuItem>
              </Select>
            </FormControl>
          </Box>
        )
      }
    },
    {
      field: '_value',
      headerName: 'Value',
      flex: 1,
      editable: true,
      sortable: false
      // renderCell: () => {
      //   return selectedFormType === `File` ? (
      //     <Box>
      //       <Button>Select Files</Button>
      //     </Box>
      //   ) : null
      // }
    },
    {
      field: '_desc',
      headerName: 'Description',
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
      renderCell: (params) => {
        return rowIdHover === params.id && !isLastRow(params.id) ? (
          <IconButton
            onClick={() => {
              deleteRow(params.id)
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null
      }
    }
  ]

  const readonlyColumns: GridColDef[] = [
    {
      field: '_key',
      headerName: 'Key',
      flex: 1,
      editable: false,
      sortable: false
    },
    {
      field: '_value',
      headerName: 'Value',
      flex: 1,
      editable: false,
      sortable: false
    },
    {
      field: '_desc',
      headerName: 'Description',
      flex: 1,
      editable: false,
      sortable: false
    }
  ]

  useEffect(() => {
    if (request) {
      setRequestClone(JSON.parse(JSON.stringify(request)))
      dispatch(configService.navItemOpened(request))
    }
  }, [dispatch, request])

  useEffect(() => {
    try {
      return paramsRef.current.subscribeEvent('rowMouseEnter', handleMouseEnter)
    } catch {
      /* empty */
    }
  }, [paramsRef, reqTabIndex])

  useEffect(() => {
    try {
      return paramsRef.current.subscribeEvent('rowMouseLeave', handleMouseLeave)
    } catch {
      /* empty */
    }
  }, [paramsRef, reqTabIndex])

  useEffect(() => {
    try {
      return headersRef.current.subscribeEvent('rowMouseEnter', handleMouseEnter)
    } catch {
      /* empty */
    }
  }, [headersRef, reqTabIndex])

  useEffect(() => {
    try {
      return headersRef.current.subscribeEvent('rowMouseLeave', handleMouseLeave)
    } catch {
      /* empty */
    }
  }, [headersRef, reqTabIndex])

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <WorkspaceNavBar />
        <Box sx={{ pt: 1 }}>
          <Divider />
        </Box>
      </Box>
      <Box sx={{ pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <TextField
            id="outlined-basic"
            label="Title"
            variant="outlined"
            size="small"
            value={requestClone.title}
            onChange={(e) => {
              setRequestClone({ ...requestClone, title: e.target.value as string })
            }}
          />
        </Box>
        <Box>
          <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
      <Box sx={{ pt: 3, display: 'flex', alignItems: 'center' }}>
        <Box>
          <FormControl sx={{ minWidth: 120, mr: 1 }} size="small">
            <InputLabel id="label-method">Method</InputLabel>
            <Select
              labelId="label-method"
              id="select-method"
              label="Method"
              value={requestClone.method}
              onChange={(e) => {
                setRequestClone({ ...requestClone, method: e.target.value as string })
              }}
            >
              <MenuItem value={'GET'}>GET</MenuItem>
              <MenuItem value={'POST'}>POST</MenuItem>
              <MenuItem value={'PUT'}>PUT</MenuItem>
              <MenuItem value={'DELETE'}>DELETE</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ flexGrow: 1, mr: 1 }}>
          <TextField
            id="outlined-basic"
            label="URL"
            variant="outlined"
            size="small"
            fullWidth
            value={requestClone.url}
            onChange={(e) => {
              setRequestClone({ ...requestClone, url: e.target.value as string })
            }}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            startIcon={<SendIcon />}
            onClick={() => {
              handleSend()
              handleSave()
            }}
          >
            Send
          </Button>
        </Box>
      </Box>
      <Box sx={{ pt: 1 }}>
        <Tabs value={reqTabIndex} onChange={handleChangeReqTab}>
          <Tab label="Params" />
          <Tab label="Headers" />
          <Tab label="Body" />
          <Tab label="Expected Result" />
        </Tabs>
      </Box>
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {reqTabIndex === 0 && (
          <Box sx={{ height: '40%', overflow: 'auto' }}>
            <DataGrid
              apiRef={paramsRef}
              rows={requestClone.params}
              columns={editableColumns}
              editMode="row"
              checkboxSelection
              disableRowSelectionOnClick
              hideFooter
              disableColumnMenu
              rowSelectionModel={requestClone.paramsSelection}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRequestClone({
                  ...requestClone,
                  paramsSelection: newRowSelectionModel as string[]
                })
              }}
              processRowUpdate={(newRow) => {
                const newRows = handleProcessNewRows(newRow, requestClone.params)
                setRequestClone({ ...requestClone, params: newRows })
                return newRow
              }}
              onProcessRowUpdateError={(e) => console.log(e)}
            />
          </Box>
        )}
        {reqTabIndex === 1 && (
          <Box sx={{ height: '40%', overflow: 'auto' }}>
            <DataGrid
              apiRef={headersRef}
              rows={requestClone.headers}
              columns={editableColumns}
              editMode="row"
              checkboxSelection
              disableRowSelectionOnClick
              hideFooter
              disableColumnMenu
              rowSelectionModel={requestClone.headersSelection}
              onRowSelectionModelChange={(newRowSelectionModel) => {
                setRequestClone({
                  ...requestClone,
                  headersSelection: newRowSelectionModel as string[]
                })
              }}
              processRowUpdate={(newRow) => {
                const newRows = handleProcessNewRows(newRow, requestClone.headers)
                setRequestClone({ ...requestClone, headers: newRows })
                return newRow
              }}
              onProcessRowUpdateError={(e) => console.log(e)}
            />
          </Box>
        )}
        {reqTabIndex === 2 && (
          <Box sx={{ height: '40%', width: `100%` }}>
            <Box>
              <FormControl sx={{ height: `10%`, pl: 1.5 }}>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={selectedBodyType}
                  onChange={handleChangeBodyType}
                >
                  <FormControlLabel value="form-data" control={<Radio />} label="form-data" />
                  <FormControlLabel value="raw" control={<Radio />} label="raw" />
                </RadioGroup>
              </FormControl>
              {selectedBodyType === 'raw' && (
                <FormControl sx={{ py: 0.5, minWidth: '8rem' }} size="small">
                  <Select
                    sx={{ height: '2rem' }}
                    value={requestClone.body.rawType}
                    onChange={(e) =>
                      setRequestClone({
                        ...requestClone,
                        body: { ...requestClone.body, rawType: e.target.value }
                      })
                    }
                  >
                    <MenuItem value={'Text'}>Text</MenuItem>
                    <MenuItem value={'JavaScript'}>JavaScript</MenuItem>
                    <MenuItem value={'JSON'}>JSON</MenuItem>
                    <MenuItem value={'HTML'}>HTML</MenuItem>
                    <MenuItem value={'XML'}>XML</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>

            {selectedBodyType === 'form-data' ? (
              <Box sx={{ height: '85%', overflow: 'auto' }}>
                <DataGrid
                  apiRef={bodyRef}
                  rows={requestClone.body.formData}
                  columns={editableBodyColumns}
                  editMode="row"
                  checkboxSelection
                  disableRowSelectionOnClick
                  hideFooter
                  disableColumnMenu
                  rowSelectionModel={requestClone.body.formDataSelection}
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    setRequestClone({
                      ...requestClone,
                      body: {
                        ...requestClone.body,
                        formDataSelection: newRowSelectionModel as string[]
                      }
                    })
                  }}
                  processRowUpdate={(newRow) => {
                    const newRows = handleProcessNewRows(newRow, requestClone.body.formData)
                    setRequestClone({
                      ...requestClone,
                      body: { ...requestClone.body, formData: newRows }
                    })
                    return newRow
                  }}
                  onProcessRowUpdateError={(e) => console.log(e)}
                />
              </Box>
            ) : (
              <Box sx={{ height: `85%`, overflow: `auto` }}>
                <Box ref={codeBoxRef} sx={{ flexGrow: 1 }}>
                  <CodeMirror
                    extensions={getExtension(requestClone.body.rawType)}
                    value={requestClone.body.rawData}
                    onChange={(value) =>
                      setRequestClone({
                        ...requestClone,
                        body: { ...requestClone.body, rawData: value }
                      })
                    }
                  />
                </Box>
              </Box>
            )}
          </Box>
        )}
        {reqTabIndex === 3 && (
          <Box sx={{ height: '40%', overflow: 'auto' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box ref={codeBoxRef} sx={{ flexGrow: 1 }}>
                <CodeMirror
                  extensions={[json()]}
                  value={requestClone.expectedResult}
                  onChange={(value) =>
                    setRequestClone({
                      ...requestClone,
                      expectedResult: value
                    })
                  }
                />
              </Box>
            </Box>
          </Box>
        )}
        <Box sx={{ height: '60%', py: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ pb: 2 }}>
            <Divider />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>Response</Box>
            <Stack direction="row" spacing={1}>
              <Chip
                label={`${request.response.status} status`}
                variant="outlined"
                color="primary"
              />
              <Chip label={`${request.response.elapsed} ms`} variant="outlined" color="primary" />
            </Stack>
          </Box>
          <Box sx={{ pt: 2 }}>
            <Tabs value={resTabIndex} onChange={handleChangeResTab}>
              <Tab label="Body" />
              <Tab label="Headers" />
              {requestClone.expectedResult.length !== 0 ? <Tab label="Result Diff" /> : null}
            </Tabs>
          </Box>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {resTabIndex === 0 && (
              <Box sx={{ height: '100%', overflow: 'auto' }}>
                <CodeMirror extensions={[json()]} value={request.response.body} editable={false} />
              </Box>
            )}
            {resTabIndex === 1 && (
              <Box sx={{ height: '100%', overflow: 'auto' }}>
                <DataGrid
                  rows={request.response.headers}
                  columns={readonlyColumns}
                  editMode="row"
                  disableRowSelectionOnClick
                  hideFooter
                  disableColumnMenu
                />
              </Box>
            )}
            {resTabIndex === 2 && (
              <Box sx={{ height: '100%', overflow: 'auto' }}>
                <CodeMirrorMerge>
                  <CodeMirrorMerge.Original
                    value={requestClone.expectedResult}
                    extensions={[json()]}
                  />
                  <CodeMirrorMerge.Modified value={request.response.body} extensions={[json()]} />
                </CodeMirrorMerge>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
