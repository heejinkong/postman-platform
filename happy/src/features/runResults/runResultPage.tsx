import { Box, Container, Divider, Typography } from '@mui/material'
import RunTestPage from '../runTests/RunTestPage'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hook'
import { selectRunResultById } from './service/runResultSlice'

export default function RunResultPage() {
  const { runResultId } = useParams()

  const runResult = useAppSelector((state) => selectRunResultById(state, runResultId ?? ''))

  return (
    <Container>
      <Box sx={{ mt: 2.2 }}>Run Result</Box>
      <Divider />
      <Box sx={{ mt: 10, ml: 23 }}>
        <Typography variant="h4" gutterBottom>
          Run Results
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please click on one item to check its run details.
        </Typography>
        <Divider sx={{ my: 7 }} />
      </Box>
      <Box sx={{ mt: -17 }}>
        <RunTestPage parent={runResult} />
      </Box>
    </Container>
  )
}
