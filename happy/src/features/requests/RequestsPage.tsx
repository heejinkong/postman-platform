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
import { html } from '@codemirror/lang-html'
import { xml } from '@codemirror/lang-xml'
import { json } from '@codemirror/lang-json'
// import { text } from '@codemirror/lang-text'
import requestService from './service/requestService'
import axios from 'axios'
import Radio from '@mui/joy/Radio'
import RadioGroup from '@mui/joy/RadioGroup'
import configService from '../config/service/configService'
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

type reqParam = { paramKey: string; value: string; desc: string; isChecked: boolean }
type reqHeader = { headerKey: string; value: string; desc: string; isChecked: boolean }
type reqBody = { bodyKey: string; value: string; desc: string; isChecked: boolean }

export default function RequestsPage() {
  const { requestId } = useParams()

  const [title, setTitle] = useState('')
  const [method, setMethod] = React.useState('')
  const [url, setUrl] = React.useState('')

  const [params, setParams] = useState<reqParam[]>([])
  const [header, setHeader] = useState<reqHeader[]>([])
  const [body, setBody] = useState<reqBody[]>([])

  const [currentMethod, setCurrentMethod] = React.useState('' as string)
  const [currentUrl, setCurrentUrl] = React.useState('' as string)
  // const [currentParams, setCurrentParams] = React.useState([] as reqParam[])

  useEffect(() => {
    setCurrentMethod(method)
    setCurrentUrl(url)
  }, [method, url])

  //------------Param에 대한 params, header, body 값
  const isRequiredEmptyParam = (p: reqParam[]) => {
    if (p.length === 0) {
      return true
    }
    const lastParam = p[p.length - 1]
    return lastParam.paramKey !== '' || lastParam.value !== '' || lastParam.desc !== ''
  }

  const onChangeParams = (_index: number, cloned: reqParam[]) => {
    const lastItem = cloned[cloned.length - 1]
    if (lastItem.paramKey !== '' || lastItem.value !== '' || lastItem.desc !== '') {
      cloned.push({ paramKey: '', value: '', desc: '', isChecked: true })
    }
    setParams(cloned)
  }

  const selectedParams = params.filter((param) => param.isChecked === true)

  //------------Header에 대한 params, header, body 값
  const isRequiredEmptyParamHeader = (pH: reqHeader[]) => {
    if (pH.length === 0) {
      return true
    }
    const lastHeader = pH[pH.length - 1]
    return lastHeader.headerKey !== '' || lastHeader.value !== '' || lastHeader.desc !== ''
  }

  const onChangeHeader = (_index: number, cloned: reqHeader[]) => {
    const lastHeaderItem = cloned[cloned.length - 1]
    if (
      lastHeaderItem.headerKey !== '' ||
      lastHeaderItem.value !== '' ||
      lastHeaderItem.desc !== ''
    ) {
      cloned.push({ headerKey: '', value: '', desc: '', isChecked: true })
    }
    setHeader(cloned)
  }

  // const selectedHeader = header.filter((header) => header.isChecked === true)

  //------------Body에 대한 params, header, body 값
  const isRequiredEmptyParamBody = (pB: reqBody[]) => {
    if (pB.length === 0) {
      return true
    }
    const lastBody = pB[pB.length - 1]
    return lastBody.bodyKey !== '' || lastBody.value !== '' || lastBody.desc !== ''
  }

  const onChangeBody = (_index: number, cloned: reqBody[]) => {
    const lastBodyItem = cloned[cloned.length - 1]
    if (lastBodyItem.bodyKey !== '' || lastBodyItem.value !== '' || lastBodyItem.desc !== '') {
      cloned.push({ bodyKey: '', value: '', desc: '', isChecked: true })
    }
    setBody(cloned)
  }

  // const selectedBody = body.filter((body) => body.isChecked === true)

  //------------url에 대한 params, header, body 값
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

  //------------current tab index
  const [tabOption, setTabOption] = useState('1')

  const [expectedValue, setExpectedValue] = useState('')

  const dispatch = useAppDispatch()
  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))

  const [selectedValue, setSelectedValue] = React.useState(`form-data`)
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedValue(event.target.value)
  }

  const onCodeChange = React.useCallback((value: string) => {
    setExpectedValue(value)
  }, [])

  useEffect(() => {
    if (!request) {
      return
    }
    dispatch(configService.navItemOpened(request))

    setTitle(request.title)
    setMethod(request.method)
    setUrl(request.url)

    const clonedParams = JSON.parse(JSON.stringify(request.params))
    if (isRequiredEmptyParam(clonedParams)) {
      clonedParams.push({
        paramKey: '',
        value: '',
        desc: '',
        isChecked: true
      })
    }
    setParams(clonedParams)
    setTabOption('1')

    const clonedHeader = JSON.parse(JSON.stringify(request.header))
    if (isRequiredEmptyParamHeader(clonedHeader)) {
      clonedHeader.push({
        headerKey: '',
        value: '',
        desc: '',
        isChecked: true
      })
    }
    setHeader(clonedHeader)

    const clonedBody = JSON.parse(JSON.stringify(request.body))
    if (isRequiredEmptyParamBody(clonedBody)) {
      clonedBody.push({
        bodyKey: '',
        value: '',
        desc: '',
        isChecked: true
      })
    }
    setBody(clonedBody)

    window.onbeforeunload = function () {
      return '저장하지 않은 데이터가 있습니다.'
    }
    window.onbeforeunload = null
  }, [dispatch, request])

  const handleMethodChange = (event: SelectChangeEvent<string>) => {
    setCurrentMethod(event.target.value)
  }

  const handleUpdateClick = () => {
    const cloned: requestItem = JSON.parse(JSON.stringify(request))
    cloned.title = title
    cloned.method = currentMethod
    cloned.url = addUrl(currentUrl)
    cloned.params = params
    cloned.expected = expectedValue

    dispatch(requestService.update(cloned))
  }

  const handleChange = (_event: React.SyntheticEvent, newTabOption: string) => {
    setTabOption(newTabOption)
  }

  const handleSendClick = async () => {
    const response = await axios({
      method: currentMethod,
      url: addUrl(currentUrl),
      params: selectedParams
    })
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

  const handleParamsDeleteClick = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(params))
    cloned.splice(index, 1)
    setParams(cloned)
  }

  const handleHeaderDeleteClick = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(header))
    cloned.splice(index, 1)
    setHeader(cloned)
  }

  const handleBodyDeleteClick = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(body))
    cloned.splice(index, 1)
    setBody(cloned)
  }

  const [code, setCode] = React.useState('')
  const [type, setType] = React.useState('10')
  const [contentType, setContentType] = React.useState(xml())
  const handleTypeChange = (value: string) => {
    setCode(value)
  }

  const handleTypeOptionChange = (event: SelectChangeEvent<string>) => {
    setType(event.target.value)
    switch (event.target.value) {
      case '10':
        setContentType(javascript())
        break
      case '20':
        setContentType(javascript())
        break
      case '30':
        setContentType(json())
        break
      case '40':
        setContentType(html())
        break
      case '50':
        setContentType(xml())
        break
    }
  }

  return (
    <Box>
      <Box sx={{ p: 2 }}>
        <WorkspaceNavBar />
      </Box>
      <Box sx={{ px: 2 }}>
        <Divider />
      </Box>
      <Box sx={{ p: 2 }}>
        {/*----------------------------------Request info----------------------------------*/}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', pb: 2 }}>
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
            <Button variant="outlined" size="large" onClick={handleUpdateClick}>
              Save
            </Button>
          </Box>
        </Box>
        {/*----------------------------------Request info----------------------------------*/}

        {/*----------------------------------Request URL----------------------------------*/}
        <Box sx={{ display: 'flex', pb: 2 }}>
          <FormControl variant="filled" sx={{ minWidth: 150 }}>
            <InputLabel id="demo-simple-select-standard-label">Method</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={currentMethod}
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
                setCurrentUrl(e.target.value)
              }}
              value={currentUrl}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
            <Button variant="contained" size="large" onClick={handleSendClick}>
              Send
            </Button>
          </Box>
        </Box>
        {/*----------------------------------Request URL----------------------------------*/}

        {/*----------------------------------Params Header Body Result----------------------------------*/}
        <Box sx={{ bgcolor: 'background.paper' }}>
          {/*----------------------------------Tab Tab----------------------------------*/}
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
            {/*----------------------------------Tab Tab----------------------------------*/}

            {/*----------------------------------Params Tab----------------------------------*/}
            <TabPanel value="1">
              <Box>
                <Table sx={{ '& thead th:nth-of-child(1)': { width: '5%' } }}>
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
                    {params.map((row, index) => (
                      <tr key={index}>
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
                          {index !== params.length - 1 ? (
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleParamsDeleteClick(index)}
                            >
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
            {/*----------------------------------Params Tab----------------------------------*/}

            {/*----------------------------------Header Tab----------------------------------*/}
            <TabPanel value="2">
              <Box>
                <Table sx={{ '& thead th:nth-of-child(1)': { width: '5%' } }}>
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
                    {header.map((row, index) => (
                      <tr key={index}>
                        <td>
                          <Checkbox
                            {...label}
                            checked={row.isChecked}
                            onChange={(e) => {
                              const cloned = JSON.parse(JSON.stringify(header))
                              cloned[index].isChecked = e.target.checked
                              onChangeHeader(index, cloned)
                            }}
                          />
                        </td>
                        <td>
                          <TextField
                            id="headerKey"
                            label="Key"
                            variant="outlined"
                            onChange={(e) => {
                              const cloned = JSON.parse(JSON.stringify(header))
                              cloned[index].headerKey = e.target.value
                              onChangeHeader(index, cloned)
                            }}
                            value={row.headerKey}
                          />
                        </td>
                        <td>
                          <TextField
                            id="headerValue"
                            label="Value"
                            variant="outlined"
                            onChange={(e) => {
                              const cloned = JSON.parse(JSON.stringify(header))
                              cloned[index].value = e.target.value
                              onChangeHeader(index, cloned)
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
                              const cloned = JSON.parse(JSON.stringify(header))
                              cloned[index].desc = e.target.value
                              onChangeHeader(index, cloned)
                            }}
                            value={row.desc}
                          />
                        </td>
                        <td>
                          {index !== header.length - 1 ? (
                            <IconButton
                              aria-label="delete"
                              onClick={() => handleHeaderDeleteClick(index)}
                            >
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
            {/*----------------------------------Header Tab----------------------------------*/}

            {/*----------------------------------Body Tab----------------------------------*/}
            <TabPanel value="3">
              <FormControl sx={{ justifyContent: 'flex-start' }}>
                <RadioGroup
                  defaultValue="female"
                  name="controlled-radio-buttons-group"
                  value={selectedValue}
                  onChange={handleRadioChange}
                  sx={{ display: 'flex', flexDirection: 'row' }}
                >
                  <Radio value="form-data" label="form-data" />
                  <Radio value="raw" label="raw" sx={{ ml: 2, marginBlockStart: 0 }} />
                  {selectedValue === `raw` ? (
                    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, mt: -0.5, ml: 2 }}>
                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={type}
                        onChange={handleTypeOptionChange}
                      >
                        <MenuItem value={10}>Text</MenuItem>
                        <MenuItem value={20}>JavaScript</MenuItem>
                        <MenuItem value={30}>JSON</MenuItem>
                        <MenuItem value={40}>HTML</MenuItem>
                        <MenuItem value={50}>XML</MenuItem>
                      </Select>
                    </FormControl>
                  ) : (
                    ''
                  )}
                </RadioGroup>
              </FormControl>

              <Box>
                {selectedValue === 'form-data' ? (
                  <Box>
                    <Table sx={{ '& thead th:nth-of-child(1)': { width: '5%' } }}>
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
                        {body.map((row, index) => (
                          <tr key={index}>
                            <td>
                              <Checkbox
                                {...label}
                                checked={row.isChecked}
                                onChange={(e) => {
                                  const cloned = JSON.parse(JSON.stringify(body))
                                  cloned[index].isChecked = e.target.checked
                                  onChangeBody(index, cloned)
                                }}
                              />
                            </td>
                            <td>
                              <TextField
                                id="bodyKey"
                                label="Key"
                                variant="outlined"
                                onChange={(e) => {
                                  const cloned = JSON.parse(JSON.stringify(body))
                                  cloned[index].bodyKey = e.target.value
                                  onChangeBody(index, cloned)
                                }}
                                value={row.bodyKey}
                              />
                            </td>
                            <td>
                              <TextField
                                id="bodyValue"
                                label="Value"
                                variant="outlined"
                                onChange={(e) => {
                                  const cloned = JSON.parse(JSON.stringify(body))
                                  cloned[index].value = e.target.value
                                  onChangeBody(index, cloned)
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
                                  const cloned = JSON.parse(JSON.stringify(body))
                                  cloned[index].desc = e.target.value
                                  onChangeBody(index, cloned)
                                }}
                                value={row.desc}
                              />
                            </td>
                            <td>
                              {index !== body.length - 1 ? (
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => handleBodyDeleteClick(index)}
                                >
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
                ) : (
                  <CodeMirror
                    value={code}
                    height="200px"
                    theme="light"
                    extensions={[contentType]}
                    onChange={handleTypeChange}
                  />
                )}
              </Box>
            </TabPanel>
            {/*----------------------------------Body Tab----------------------------------*/}

            {/*----------------------------------Result Tab----------------------------------*/}
            <TabPanel value="4">
              <Box>
                <CodeMirror
                  value={expectedValue}
                  height="200px"
                  theme="light"
                  extensions={[javascript({ jsx: true })]}
                  onChange={onCodeChange}
                />
              </Box>
            </TabPanel>
          </TabContext>
        </Box>
        {/*----------------------------------Params Header Body Result----------------------------------*/}

        {/*----------------------------------Response----------------------------------*/}
        <Box sx={{ mt: 22 }}>
          <Divider />
          <Box>
            <ResponsesPage expectedValue={expectedValue} />
          </Box>
        </Box>
        {/*----------------------------------Response----------------------------------*/}
      </Box>
    </Box>
  )
}
