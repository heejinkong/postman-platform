import { Box, Container, Divider, Typography } from '@mui/material'
import RunTestPage from '../runTests/RunTestPage'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hook'
import { selectRunResultById } from './service/runResultSlice'

export default function RunResultPage() {
  const { runResultId } = useParams()

  const runResult = useAppSelector((state) => selectRunResultById(state, runResultId ?? ''))

  return (
    // run을 실행한 결과를 상세히 보여주는 페이지
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/*RunResultPage의 상단 영역*/}
      <Box sx={{ px: 1, py: 0.75 }}>Run Result</Box>
      <Divider />
      <Container sx={{ pt: 3, flexGrow: 1 }}>
        {/*RunResultPage의 문구*/}
        <Box sx={{ pb: 3.75 }}>
          <Typography variant="h4" sx={{ pb: 0.75 }}>
            Run Results
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Please click on one item to check its run details.
          </Typography>
        </Box>
        {/* <Divider sx={{ my: 7 }} /> */}
        <Box sx={{ pb: 5 }}>
          {/*// runResultId에 해당하는 runResult를 가져와서 RunTestPage 컴포넌트에 전달*/}
          <RunTestPage parent={runResult} />
        </Box>
      </Container>
    </Box>
  )
}
