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
  SelectChangeEvent,
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
import {
  DataGrid,
  GridEventListener,
  GridColDef,
  useGridApiRef,
  GridRowId,
  GridRenderCellParams
} from '@mui/x-data-grid'
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
type FormFileType = {
  id: string
  file: File
  name: string
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
    console.log(requestClone.body.formData)
    dispatch(requestService.update(requestClone))
  }

  const handleSend = async () => {
    // dispatch(requestService.send(requestClone))
    const response = await dispatch(
      requestService.send({ request: requestClone, formFiles: formFiles })
    )
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
    setRequestClone({
      ...requestClone,
      body: { ...requestClone.body, mode: e.target.value }
    })
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

  type RowFormData = {
    id: string
    _key: string
    _dataType: string
    _value: string[]
    _desc: string
  }

  const handleProcessNewRowsFormData = (newRowFormData: RowFormData, targetRows: RowFormData[]) => {
    const newRowsFormData = [...targetRows]
    const index = newRowsFormData.findIndex((row) => row.id === newRowFormData.id)
    newRowsFormData[index] = newRowFormData
    const lastRow = newRowsFormData[newRowsFormData.length - 1]
    if (
      lastRow._key !== '' ||
      (lastRow._value && lastRow._value.length !== 0) ||
      lastRow._desc !== ''
    ) {
      newRowsFormData.push({
        id: uuidv4(),
        _key: '',
        _dataType: 'Text',
        _value: [],
        _desc: ''
      })
    }

    return newRowsFormData
  }

  const isLastRow = (id: GridRowId) => {
    if (reqTabIndex === 0) {
      return id === requestClone.params[requestClone.params.length - 1].id
    } else if (reqTabIndex === 1) {
      return id === requestClone.headers[requestClone.headers.length - 1].id
    } else if (reqTabIndex === 2) {
      return id === requestClone.body.formData[requestClone.body.formData.length - 1].id
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
    } else if (reqTabIndex === 2) {
      const newRows = [...requestClone.body.formData]
      const index = newRows.findIndex((row) => row.id === id)
      newRows.splice(index, 1)
      setRequestClone({ ...requestClone, body: { ...requestClone.body, formData: newRows } })
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
        //마지막 row가 아니고, 마우스가 해당 row에 hover 되었을 때, 삭제 버튼 표시
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

  const [formData, setFormData] = useState<RowFormData[]>(requestClone.body.formData)
  const [formFiles, setFormFile] = useState<FormFileType[]>([])

  useEffect(() => {
    setFormData(requestClone.body.formData)
  }, [requestClone.body.formData])

  const handleChangeFormType = (event: SelectChangeEvent<string>, id: GridRowId) => {
    const newRowsFormData = formData.map((row) => {
      if (row.id === id) {
        return { ...row, _dataType: event.target.value as string, _value: [] as string[] }
      }
      return row
    })

    setFormData(newRowsFormData)
    setRequestClone({
      ...requestClone,
      body: { ...requestClone.body, formData: [...newRowsFormData] }
    })
  }

  const handleClickFile = (id: GridRowId) => {
    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.multiple = false
    fileInput.addEventListener('change', (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        const formFile: FormFileType = {
          id: id as string,
          file: files[0],
          name: files[0].name
        }
        console.log(formFile.name)

        const cloneFormFiles = [...formFiles]
        const item = cloneFormFiles.find((i) => i.id === id)
        if (item) {
          item.file = files[0]
          item.name = files[0].name
        } else {
          cloneFormFiles.push(formFile)
        }

        setFormFile(cloneFormFiles)

        const cloneFormData = [...formData]
        const index = cloneFormData.findIndex((row) => row.id === id)
        cloneFormData[index]._value = [files[0].name] as string[]
        setFormData(cloneFormData)
      }
    })
    fileInput.click()
  }

  const handleDelete = (id: GridRowId, index: number) => {
    setRequestClone((prevRequestClone) => {
      return {
        ...prevRequestClone,
        body: {
          ...prevRequestClone.body,
          formData: prevRequestClone.body.formData.map((formItem) => {
            if (formItem.id === id && formItem._dataType === 'File') {
              const updatedFiles = (formItem._value as string[]).filter(
                (_: string, i: number) => i !== index
              )

              return {
                ...formItem,
                _value: updatedFiles
              }
            }
            return formItem
          })
        }
      }
    })
  }

  const createEditableColumns = (isFile: boolean) => [
    {
      field: '_key',
      headerName: 'Key',
      flex: 1,
      editable: true,
      sortable: false
    },
    {
      field: '_dataType',
      headerName: '',
      width: 100,
      editable: false,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        /* Body탭의 form-data의 경우, dataType을 선택할 수 있는 select box 표시 */
        <Box>
          <FormControl sx={{ py: 0.5, minWidth: '8rem' }} size="small">
            <Select
              sx={{ height: '1.5rem', width: `5rem`, fontSize: '0.9rem' }}
              value={params.row._dataType}
              onChange={(event) => handleChangeFormType(event, params.id)}
            >
              <MenuItem value="Text">Text</MenuItem>
              <MenuItem value="File">File</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )
    },
    {
      field: '_value',
      headerName: 'Value',
      flex: 1,
      editable: !isFile,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => {
        const handleClick = () => {
          if (params.row._dataType === 'File') {
            handleClickFile(params.id)
          } else {
            params.api.getCellMode(params.id, params.field)
          }
        }

        return (
          <Box
            onClick={handleClick}
            sx={{
              width: '100%',
              cursor: params.row._dataType === 'File' ? 'pointer' : 'text',
              maxWidth: 440,
              overflowX: 'auto'
            }}
          >
            {params.row._dataType === 'File' ? (
              // Body탭의 form-data의 dataType이 File일 경우
              params.value && (params.value as string[]).length > 0 ? (
                // 파일이 선택되었을 경우, 파일 이름 표시
                <div>
                  {Array.from(params.value as string[]).map((fileName, index) => (
                    <Chip
                      key={index}
                      label={fileName}
                      size="small"
                      onDelete={() => handleDelete(params.id, index)}
                    />
                  ))}
                </div>
              ) : (
                // 파일이 선택되지 않았을 경우, 파일 선택 버튼 표시
                <div>Select files</div>
              )
            ) : (
              // Body탭의 form-data의 dataType이 Text일 경우, value 표시
              <div>{params.value}</div>
            )}
          </Box>
        )
      }
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
      renderCell: (params: GridRenderCellParams) =>
        //마지막 row가 아니고, 마우스가 해당 row에 hover 되었을 때, 삭제 버튼 표시
        !isLastRow(params.id) ? (
          <IconButton
            onClick={() => {
              deleteRow(params.id)
            }}
          >
            <DeleteIcon />
          </IconButton>
        ) : null
    }
  ]

  const editableBodyColumns = createEditableColumns(false)

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
    //RequestPage에서는 해당 request의 정보를 생성, 수정하는 페이지
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* RequestPage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <Box>
        <WorkspaceNavBar _id={requestId ?? ''} />
        <Box sx={{ pt: 1 }}>
          <Divider />
        </Box>
      </Box>

      <Box sx={{ pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* RequestPage의 title */}
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
        {/* RequestPage의 저장 버튼 */}
        <Box>
          <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
      <Box sx={{ pt: 3, display: 'flex', alignItems: 'center' }}>
        {/* FormControl을 통해 method 선택 */}
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
              {/* method 종류 */}
              <MenuItem value={'GET'}>GET</MenuItem>
              <MenuItem value={'POST'}>POST</MenuItem>
              <MenuItem value={'PUT'}>PUT</MenuItem>
              <MenuItem value={'DELETE'}>DELETE</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* TextField를 통해 url 입력 */}
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
        {/* Send 버튼을 통해 request 전송 */}
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
      {/*Tab을 통해 Params, Headers, Body, Expected Result 선택*/}
      <Box sx={{ pt: 1 }}>
        <Tabs value={reqTabIndex} onChange={handleChangeReqTab}>
          <Tab label="Params" />
          <Tab label="Headers" />
          <Tab label="Body" />
          <Tab label="Expected Result" />
        </Tabs>
      </Box>
      {/* 선택한 Tab에 따라 다른 DataGrid 표시 */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {/*Params Tab일 경우*/}
        {reqTabIndex === 0 && (
          <Box sx={{ height: '40%', overflow: 'auto' }}>
            {/* DataGrid를 통해 params 표시 */}
            <DataGrid
              apiRef={paramsRef}
              rows={requestClone.params}
              columns={editableColumns}
              editMode="row"
              checkboxSelection
              disableRowSelectionOnClick
              hideFooter
              disableColumnMenu
              rowSelectionModel={requestClone.paramsSelection} // check 선택한 row 표시
              onRowSelectionModelChange={(newRowSelectionModel) => {
                // check 선택한 row 변경 시, requestClone에 반영
                setRequestClone({
                  ...requestClone,
                  paramsSelection: newRowSelectionModel as string[]
                })
              }}
              processRowUpdate={(newRow) => {
                // row 수정 시, requestClone에 반영
                const newRows = handleProcessNewRows(newRow, requestClone.params)
                setRequestClone({ ...requestClone, params: newRows })
                return newRow
              }}
              onProcessRowUpdateError={(e) => console.log(e)}
            />
          </Box>
        )}
        {/*Headers Tab일 경우*/}
        {reqTabIndex === 1 && (
          <Box sx={{ height: '40%', overflow: 'auto' }}>
            {/* DataGrid를 통해 headers 표시 */}
            <DataGrid
              apiRef={headersRef}
              rows={requestClone.headers}
              columns={editableColumns}
              editMode="row"
              checkboxSelection
              disableRowSelectionOnClick
              hideFooter
              disableColumnMenu
              rowSelectionModel={requestClone.headersSelection} // check 선택한 row 표시
              onRowSelectionModelChange={(newRowSelectionModel) => {
                // check 선택한 row 변경 시, requestClone에 반영
                setRequestClone({
                  ...requestClone,
                  headersSelection: newRowSelectionModel as string[]
                })
              }}
              processRowUpdate={(newRow) => {
                // row 수정 시, requestClone에 반영
                const newRows = handleProcessNewRows(newRow, requestClone.headers)
                setRequestClone({ ...requestClone, headers: newRows })
                return newRow
              }}
              onProcessRowUpdateError={(e) => console.log(e)}
            />
          </Box>
        )}
        {/*Body Tab일 경우*/}
        {reqTabIndex === 2 && (
          <Box sx={{ height: '40%', width: `100%` }}>
            <Box>
              {/* RadioGroup을 통해 Body 타입 선택 (form-data or raw)*/}
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
                // Body 타입이 raw일 경우, Select를 통해 raw 타입 선택
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
                    {' '}
                    {/* MenuItem을 통해 raw 타입 종류 선택 */}
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
              // Body 타입이 form-data일 경우, DataGrid를 통해 form-data 표시
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
                  rowSelectionModel={requestClone.body.formDataSelection} // check 선택한 row 표시
                  onRowSelectionModelChange={(newRowSelectionModel) => {
                    // check 선택한 row 변경 시, requestClone에 반영
                    setRequestClone({
                      ...requestClone,
                      body: {
                        ...requestClone.body,
                        formDataSelection: newRowSelectionModel as string[]
                      }
                    })
                  }}
                  processRowUpdate={(newRow) => {
                    const newRows = handleProcessNewRowsFormData(newRow, requestClone.body.formData)
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
              // Body 타입이 raw일 경우, CodeMirror를 통해 raw 표시
              <Box sx={{ height: `85%`, overflow: `auto` }}>
                <Box ref={codeBoxRef} sx={{ flexGrow: 1 }}>
                  {/* 선택한 raw 타입에 따라 CodeMirror의 확장자 설정 */}
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
        {/*Expected Result Tab일 경우*/}
        {reqTabIndex === 3 && (
          <Box sx={{ height: '40%', overflow: 'auto' }}>
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box ref={codeBoxRef} sx={{ flexGrow: 1 }}>
                {/* CodeMirror를 통해 expected result 표시 */}
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

          {/* 하단 Response 영역 */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Response 문구 표시 */}
            <Box>Response</Box>
            {/* Response의 status와 elapsed time 표시 */}
            <Stack direction="row" spacing={1}>
              <Chip
                label={`${request.response.status} status`}
                variant="outlined"
                color="primary"
              />
              <Chip label={`${request.response.elapsed} ms`} variant="outlined" color="primary" />
            </Stack>
          </Box>
          {/* Response의 Body, Headers, Result Diff Tab 선택 */}
          <Box sx={{ pt: 2 }}>
            <Tabs value={resTabIndex} onChange={handleChangeResTab}>
              <Tab label="Body" />
              <Tab label="Headers" />
              {/* expected result에 값을 입력 했을 경우에만 Result Diff Tab 노출 */}
              {requestClone.expectedResult.length !== 0 ? <Tab label="Result Diff" /> : null}
            </Tabs>
          </Box>
          {/* 선택한 Tab에 따라 다른 DataGrid 표시 */}
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {/* Body Tab일 경우 */}
            {resTabIndex === 0 && (
              <Box sx={{ height: '100%', overflow: 'auto' }}>
                {/* CodeMirror을 통해 response body 표시 */}
                <CodeMirror extensions={[json()]} value={request.response.body} editable={false} />
              </Box>
            )}

            {/* Headers Tab일 경우 */}
            {resTabIndex === 1 && (
              <Box sx={{ height: '100%', overflow: 'auto' }}>
                {/* DataGrid를 통해 response headers 표시 */}
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
            {/* Result Diff Tab일 경우 */}
            {resTabIndex === 2 && (
              <Box sx={{ height: '100%', overflow: 'auto' }}>
                {/* CodeMirrorMerge를 통해 response body와 expected result를 비교하여 표시 */}
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
