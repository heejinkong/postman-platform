import { Box, Container, Divider, Typography } from '@mui/material'
import RunTestPage from '../runTests/RunTestPage'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hook'
import { selectRunResultById } from './runResultSlice'

export default function RunResultPage() {
  const { runResultId } = useParams()

  const runResult = useAppSelector((state) => selectRunResultById(state, runResultId ?? ''))

  return (
    <Container sx={{ ml: 20 }}>
      <Box sx={{ mt: 2.2 }}>Run Result</Box>
      <Divider />
      <Box sx={{ mt: 10, ml: 23 }}>
        <Typography variant="h4" gutterBottom>
          Run Results
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please click on one item to check its run details.
        </Typography>
        <Divider sx={{ my: 9 }} />
      </Box>
      <Box sx={{ mt: -20 }}>
        <RunTestPage parent={runResult} />
      </Box>
      <Box sx={{ mt: 3 }}></Box>
    </Container>
  )
}
