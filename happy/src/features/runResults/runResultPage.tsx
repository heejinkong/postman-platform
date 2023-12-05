import { Box, Container, Divider, Typography } from '@mui/material'
import RunTestPage from '../runTests/RunTestPage'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hook'
import { selectRunResultById } from './service/runResultSlice'
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'

export default function RunResultPage() {
  const { runResultId } = useParams()

  const runResult = useAppSelector((state) => selectRunResultById(state, runResultId ?? ''))

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 1, py: 0.75 }}>
        <WorkspaceNavBar />
      </Box>
      <Divider />
      <Container sx={{ pt: 3, flexGrow: 1 }}>
        <Box sx={{ pb: 3.75 }}>
          <Box sx={{ display: 'flex' }}>
            <Typography variant="h4" sx={{ pb: 0.75 }}>
              Run Results
            </Typography>
            <Box sx={{ pt: 1.8, pl: 1 }}>{new Date(runResult.created).toLocaleString()}</Box>
          </Box>
          <Typography variant="subtitle1" color="text.secondary">
            Please click on one item to check its run details.
          </Typography>
        </Box>
        <Box sx={{ pb: 5 }}>
          <RunTestPage parent={runResult} />
        </Box>
      </Container>
    </Box>
  )
}
