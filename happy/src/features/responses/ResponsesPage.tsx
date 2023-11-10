import { Box } from '@mui/material'
import { useState } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import React from 'react'
import { useAppSelector } from '../../app/hook'
import { selectRequestById } from '../requests/requestsSlice'
import { useParams } from 'react-router-dom'

export default function ResponsesPage() {
  const { requestId } = useParams()
  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))

  const resultData = JSON.stringify(request?.response?.body ?? '', null, 2)

  const [value, setValue] = useState('1')
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <Box>
      <Box sx={{ bgcolor: 'background.paper' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Body" value="1" />
              <Tab label="Headers" value="2" />
              <Tab label="Result diff" value="3" />
              <Box
                sx={{ display: `flex`, flexDirection: 'row-reverse', alignItems: `flex-end` }}
              ></Box>
            </TabList>
          </Box>
          <TabPanel value="1">
            <Box>
              <CodeMirror
                value={resultData}
                height="200px"
                theme="light"
                extensions={[javascript({ jsx: true })]}
                readOnly={true}
              />
            </Box>
          </TabPanel>
          <TabPanel value="2">Headers</TabPanel>
          <TabPanel value="3">Result diff</TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}
