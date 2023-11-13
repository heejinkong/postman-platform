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
import { selectRequestById } from './requestsSlice'
import { requestItem } from './requestItem'
import React from 'react'
import ResponsesPage from '../responses/ResponsesPage'
import { Divider } from '@mui/joy'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import requestService from './service/requestService'
import axios from 'axios'
import Radio from '@mui/joy/Radio'
import RadioGroup from '@mui/joy/RadioGroup'
import Option from '@mui/joy/Option'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

type reqParam = { paramKey: string; value: string; desc: string; isChecked: boolean }
type reqParams = reqParam[]

export default function RequestsPage() {
  const { requestId } = useParams()

  const [title, setTitle] = useState('')
  const [method, setMethod] = React.useState('')
  const [url, setUrl] = React.useState('')

  const [params, setParams] = useState<reqParams>([
    {
      paramKey: '',
      value: '',
      desc: '',
      isChecked: true
    }
  ])

  const onChangeParams = (_index: number, cloned: reqParam[]) => {
    const lastItem = cloned[cloned.length - 1]
    if (lastItem.paramKey !== '' || lastItem.value !== '' || lastItem.desc !== '') {
      cloned.push({ paramKey: '', value: '', desc: '', isChecked: true })
    }
    setParams(cloned)
  }

  const selectedParams = params.filter((param) => param.isChecked === true)

  const addUrl = (url: string) => {
    let fullUrl = url
    selectedParams.forEach((param) => {
      //selectedParams[index]가 0일경우
      if (selectedParams.indexOf(param) === 0) {
        if (param.paramKey !== '') {
          if (fullUrl.indexOf('?') === -1) {
            fullUrl += `?${param.paramKey}`
            if (param.value !== '') {
              fullUrl += `=${param.value}`
            }
          }
        }
      } //selectedParams[index]가 1일이상
      else {
        if (param.value !== '') {
          fullUrl += `&${param.paramKey}`
          if (param.value !== '') {
            fullUrl += `=${param.value}`
          }
        }
      }
    })
    return fullUrl
  }

  // current tab index
  const [tabOption, setTabOption] = useState('1')

  const [expectedValue, setExpectedValue] = useState('')

  const dispatch = useAppDispatch()
  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))

  const [selectedValue, setSelectedValue] = React.useState(`form-data`)
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  const [code, setCode] = useState('')

  const onCodeChange = React.useCallback((value: string) => {
    setCode(value)
  }, [])

  useEffect(() => {
    if (requestId === `:requestId`) {
      setTitle('')
      setMethod('')
      setUrl('')
      setTabOption('1')
    } else if (request) {
      setTitle(request.title)
      setMethod(request.method)
      setUrl(request.url)
      setParams(request.params)
      setTabOption('1')
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
    const cloned: requestItem = JSON.parse(JSON.stringify(request))
    cloned.title = title
    cloned.method = method
    cloned.url = addUrl(url)
    cloned.params = params
    dispatch(requestService.update(cloned))
  }

  useEffect(() => {
    if (!request) {
      return
    }
    setTitle(request.title)
    setMethod(request.method)
    setUrl(request.url)
  }, [request])

  const handleChange = (_event: React.SyntheticEvent, newTabOption: string) => {
    setTabOption(newTabOption)
  }

  const handleSendClick = async () => {
    const response = await axios({
      method: method,
      url: addUrl(url),
      params: selectedParams
    })
    console.log(selectedParams)
    const data = await response.data
    if (response.status === 200) {
      const cloned = JSON.parse(JSON.stringify(request))
      cloned.response.statusCode = response.status
      cloned.response.statusMsg = response.statusText
      cloned.response.header = response.headers
      cloned.response.body = data
      dispatch(requestService.update(cloned))
    }
  }

  console.log(addUrl(url))

  const rows = params

  const onChange = React.useCallback((value: string) => {
    setExpectedValue(value)
  }, [])

  const handleDeleteClick = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(params))
    cloned.splice(index, 1)
    setParams(cloned)
  }

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
          <Button variant="contained" size="large" onClick={handleSendClick}>
            Send
          </Button>
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'background.paper' }}>
        <TabContext value={tabOption}>
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
                  {rows.map((row, index) => (
                    <tr key={row.paramKey}>
                      <td>
                        <Checkbox
                          {...label}
                          checked={row.isChecked}
                          onChange={(e) => {
                            const cloned = JSON.parse(JSON.stringify(params))
                            cloned[index].isChecked = e.target.checked
                            onChangeParams(index, cloned)
                          }}
                        />
                      </td>
                      <td>
                        <TextField
                          id="paramKey"
                          label="Key"
                          variant="outlined"
                          onChange={(e) => {
                            const cloned = JSON.parse(JSON.stringify(params))
                            cloned[index].paramKey = e.target.value
                            onChangeParams(index, cloned)
                          }}
                          value={row.paramKey}
                        />
                      </td>
                      <td>
                        <TextField
                          id="paramValue"
                          label="Value"
                          variant="outlined"
                          onChange={(e) => {
                            const cloned = JSON.parse(JSON.stringify(params))
                            cloned[index].value = e.target.value
                            onChangeParams(index, cloned)
                          }}
                          value={row.value}
                        />
                      </td>
                      <td>
                        <TextField
                          id="description"
                          label="Description"
                          variant="outlined"
                          onChange={(e) => {
                            const cloned = JSON.parse(JSON.stringify(params))
                            cloned[index].desc = e.target.value
                            onChangeParams(index, cloned)
                          }}
                          value={row.desc}
                        />
                      </td>
                      <td>
                        {index !== 0 ? (
                          <IconButton aria-label="delete" onClick={() => handleDeleteClick(index)}>
                            <DeleteIcon />
                          </IconButton>
                        ) : (
                          ''
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </TabPanel>
          <TabPanel value="2">Headers</TabPanel>
          <TabPanel value="3">
            <FormControl>
              <RadioGroup
                defaultValue="female"
                name="controlled-radio-buttons-group"
                value={selectedValue}
                onChange={handleRadioChange}
                sx={{ display: 'flex', flexDirection: 'row' }}
              >
                <Radio value="form-data" label="form-data" />
                <Radio value="raw" label="raw" sx={{ ml: 2, marginBlockStart: 0 }} />
                {/* {selectedValue === `raw` ? (
                  <Select defaultValue="Text" disabled={false}>
                    <Option value="Text">Text</Option>
                    <Option value="JavaScript">JavaScript</Option>
                    <Option value="JSON">JSON</Option>
                    <Option value="HTML">HTML</Option>
                    <Option value="XML">XML</Option>
                  </Select>
                ) : (
                  ``
                )} */}
              </RadioGroup>
            </FormControl>

            <Box>
              {selectedValue === 'form-data' ? (
                'form-data'
              ) : (
                <CodeMirror
                  value={expectedValue}
                  height="200px"
                  theme="light"
                  extensions={[javascript({ jsx: true })]}
                  onChange={onChange}
                />
              )}
            </Box>
          </TabPanel>
          <TabPanel value="4">
            <Box>
              <CodeMirror
                value={code}
                height="200px"
                theme="light"
                extensions={[javascript({ jsx: true })]}
                onChange={onCodeChange}
              />
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
      <Box sx={{ mt: 15 }}>
        <Divider />
        <Box>
          <ResponsesPage expectedValue={expectedValue} />
        </Box>
      </Box>
    </Box>
  )
}
