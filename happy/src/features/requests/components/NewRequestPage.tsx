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

import { useNavigate, useParams } from 'react-router-dom'

import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById, updateCollection } from '../../collections/collectionsSlice'
import { requestItem } from '../requestItem'
import { createRequest } from '../requestsSlice'
import { collectionItem } from '../../collections/collectionItem'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

export default function NewRequestPage() {
  const { workspaceId, collectionId, requestId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [key, setKey] = useState('')
  const [paramValue, setParamValue] = useState('')
  const [description, setDescription] = useState('')
  const [method, setMethod] = React.useState('')
  const [url] = React.useState('')
  const [value, setValue] = useState('1')

  const dispatch = useAppDispatch()
  const collection = useAppSelector((state) => selectCollectionById(state, collectionId ?? ''))

  useEffect(() => {
    if (requestId === `new`) {
      setTitle('')
    }
  }, [dispatch, requestId])

  const handleMethodChange = (event: SelectChangeEvent) => {
    setMethod(event.target.value)
  }

  const handleSaveClick = () => {
    const newRequest: requestItem = {
      id: '',
      title: title,
      created: Date.now(),
      updated: Date.now(),
      authorId: 'admin',
      parentId: collection.id,
      method: method,
      url: url,
      params: [{ key: key, value: paramValue, desc: description }],
      header: [],
      body: '',
      response: {
        statusCode: 0,
        statusMsg: '',
        header: [],
        body: ''
      }
    }
    dispatch(createRequest(newRequest))

    const cloned: collectionItem = JSON.parse(JSON.stringify(collection))
    cloned.requests.push(newRequest.id)
    cloned.updated = Date.now()
    dispatch(updateCollection(cloned))

    navigate(`/workspaces/${workspaceId}/collections/${collectionId}/requests/${newRequest.id}`)
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  function createData(Check: boolean, Key: string, Value: number, Description: number) {
    return { Check, Key, Value, Description }
  }

  const rows = [createData(true, 'Frozen yoghurt', 159, 6.0)]

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
          <Button variant="contained" size="large" onClick={handleSaveClick}>
            Save
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
            value={url}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Button variant="contained" size="large" onClick={handleSaveClick}>
            Send
          </Button>
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
              <TextField
                id="outlined-multiline-static"
                label="Multiline"
                multiline
                fullWidth
                rows={4}
                defaultValue="Default Value"
              />
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}
