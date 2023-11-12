import {
  Box,
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField
} from '@mui/material'
import { useEffect, useState } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import Table from '@mui/joy/Table'
import DeleteIcon from '@mui/icons-material/Delete'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { useParams } from 'react-router-dom'
import { updateRequest, selectRequestById } from './requestsSlice'
import { requestItem } from './requestItem'
import React from 'react'
import ResponsesPage from '../responses/ResponsesPage'
import { Divider } from '@mui/joy'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import SendRequestButton from './components/SendRequestButton'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

export default function RequestsPage() {
  const { requestId } = useParams()

  const [title, setTitle] = useState('')
  const [key, setKey] = useState('')
  const [paramValue, setParamValue] = useState('')
  const [description, setDescription] = useState('')
  const [method, setMethod] = React.useState('')
  const [url, setUrl] = React.useState('')
  const [value, setValue] = useState('1')

  const dispatch = useAppDispatch()
  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))

  useEffect(() => {
    if (requestId === `:requestId`) {
      setTitle('')
      setKey('')
      setParamValue('')
      setDescription('')
      setMethod('')
      setUrl('')
      setValue('1')
    } else if (request) {
      setTitle(request.title)
      setMethod(request.method)
      setUrl(request.url)
      setValue('1')
      window.onbeforeunload = function () {
        return '저장하지 않은 데이터가 있습니다.'
      }
      return () => {
        window.onbeforeunload = null
      }
    }
  }, [dispatch, request, requestId])

  const handleMethodChange = (event: SelectChangeEvent) => {
    setMethod(event.target.value)
  }

  const handleUpdateClick = () => {
    // const newItem = new requestItem()
    // newItem.title = title
    // newItem.method = method
    // newItem.url = url
    // newItem.updated = Date.now()
    // dispatch(updateRequest(newItem))
    // console.log(newItem)

    const cloned: requestItem = JSON.parse(JSON.stringify(request))
    cloned.title = title
    cloned.method = method
    cloned.url = url
    cloned.updated = Date.now()
    dispatch(updateRequest(cloned))
    // console.log(`hi`)
    // console.log(cloned.url)
  }

  useEffect(() => {
    if (!request) {
      return
    }
    setTitle(request.title)
    setMethod(request.method)
    setUrl(request.url)
  }, [request])

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  const handleSendClick = async () => {
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok) {
      const cloned = JSON.parse(JSON.stringify(request))
      cloned.response.statusCode = response.status
      cloned.response.statusMsg = response.statusText
      cloned.response.header = response.headers
      cloned.response.body = data
      cloned.updated = Date.now()
      dispatch(updateRequest(cloned))
    }
  }

  function createData(Check: boolean, Key: string, Value: number, Description: number) {
    return { Check, Key, Value, Description }
  }

  const rows = [createData(true, 'Frozen yoghurt', 159, 6.0)]
  const onChange = React.useCallback((value: string) => {
    console.log(value)
  }, [])
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          <TextField
            fullWidth
            id="outlined-required"
            size="small"
            label="Request Title"
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            value={title}
          />
        </Box>
        <Box>
          <Button variant="contained" size="large" onClick={handleUpdateClick}>
            Update
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', mb: 3 }}>
        <FormControl variant="filled" sx={{ minWidth: 150 }}>
          <InputLabel id="demo-simple-select-standard-label">Method</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={method}
            onChange={handleMethodChange}
            label="method"
          >
            <MenuItem value="">
              <em>Method</em>
            </MenuItem>
            <MenuItem value={'get'}>GET</MenuItem>
            <MenuItem value={'post'}>POST</MenuItem>
            <MenuItem value={'put'}>PUT</MenuItem>
            <MenuItem value={'patch'}>PATCH</MenuItem>
            <MenuItem value={'delete'}>DELETE</MenuItem>
          </Select>
        </FormControl>
        <Box sx={{ flexGrow: 1, ml: 1 }}>
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="Enter URL or paste text"
            onChange={(e) => {
              setUrl(e.target.value)
            }}
            value={url}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <SendRequestButton method={method} url={url} />
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'background.paper' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Params" value="1" />
              <Tab label="Headers" value="2" />
              <Tab label="Body" value="3" />
              <Tab label="Result" value="4" />
              <Box
                sx={{ display: `flex`, flexDirection: 'row-reverse', alignItems: `flex-end` }}
              ></Box>
            </TabList>
          </Box>
          <TabPanel value="1">
            <Box>
              <Table sx={{ '& thead th:nth-child(1)': { width: '5%' } }}>
                <thead>
                  <tr>
                    <th> </th>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Description</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.Key}>
                      <td>
                        <Checkbox {...label} defaultChecked />
                      </td>
                      <td>
                        <TextField
                          id="key"
                          label="Key"
                          variant="outlined"
                          onChange={(e) => {
                            setKey(e.target.value)
                          }}
                          value={key}
                        />
                      </td>
                      <td>
                        <TextField
                          id="paramValue"
                          label="Value"
                          variant="outlined"
                          onChange={(e) => {
                            setParamValue(e.target.value)
                          }}
                          value={paramValue}
                        />
                      </td>
                      <td>
                        <TextField
                          id="description"
                          label="Description"
                          variant="outlined"
                          onChange={(e) => {
                            setDescription(e.target.value)
                          }}
                          value={description}
                        />
                      </td>
                      <td>
                        <IconButton aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </TabPanel>
          <TabPanel value="2">Headers</TabPanel>
          <TabPanel value="3">Body</TabPanel>
          <TabPanel value="4">
            <Box>
              <CodeMirror
                value={request.body}
                height="200px"
                theme="light"
                extensions={[javascript({ jsx: true })]}
                onChange={onChange}
              />
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
      <Box sx={{ mt: 15 }}>
        <Divider />
        <Box>
          <ResponsesPage />
        </Box>
      </Box>
    </Box>
  )
}
