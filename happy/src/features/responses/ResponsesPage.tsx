import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import React from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { selectRequestById } from '../requests/requestsSlice'
import { useParams } from 'react-router-dom'
import { sendRequest } from '../requests/service/requestService'
import * as Diff from 'diff'
import * as Diff2Html from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

type requestExpextedValueProps = {
  expectedValue: string
}

export default function ResponsesPage(props: requestExpextedValueProps) {
  const { requestId } = useParams()
  const dispatch = useAppDispatch()
  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))

  const [resultData, setResultData] = useState('')

  const [value, setValue] = useState('1')
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (request) {
      dispatch(sendRequest(request)).then((resultAction) => {
        if (sendRequest.fulfilled.match(resultAction)) {
          setResultData(resultAction.payload)
        }
      })
    }
  }, [dispatch, request])

  const resposne = JSON.stringify(resultData ?? '', null, 2)

  const diff = Diff.createTwoFilesPatch(
    'resultText',
    'resultData',
    `${props.expectedValue}`,
    `${resposne}`
  )

  let outputHtml = ''
  if (Diff2Html.html) {
    const diff2htmlConfig: Diff2Html.Diff2HtmlConfig = {
      matching: 'lines',
      drawFileList: false,
      outputFormat: 'side-by-side'
    }

    outputHtml = Diff2Html.html(diff, diff2htmlConfig)
    console.log(outputHtml)
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
                value={resposne}
                height="200px"
                theme="light"
                extensions={[javascript({ jsx: true })]}
                readOnly={true}
              />
            </Box>
          </TabPanel>
          <TabPanel value="2">Headers</TabPanel>
          <TabPanel value="3">
            <div dangerouslySetInnerHTML={{ __html: outputHtml }} />
            {/*
            <Paper sx={{ maxHeight: '400px', overflowY: 'auto' }}>
              <Typography variant="body1" sx={{ p: 1 }}>
                <div dangerouslySetInnerHTML={{ __html: outputHtml }} />
              </Typography>
            </Paper>
            */}
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}