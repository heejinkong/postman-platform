import { Box } from '@mui/material'
import { useState } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import React from 'react'
import { useAppSelector } from '../../app/hook'
import { selectRequestById } from '../requests/requestsSlice'
import { useParams } from 'react-router-dom'

type requestExpextedValueProps = {
  expectedValue: string
}

export default function ResponsesPage(props: requestExpextedValueProps) {
  const { requestId } = useParams()
  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))

  const resultData = JSON.stringify(request?.response?.body ?? '', null, 2)

  const [value, setValue] = useState('1')
  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return <Box></Box>
}
