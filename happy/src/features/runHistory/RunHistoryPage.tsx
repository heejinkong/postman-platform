import {
  Box,
  Container,
  Divider,
  ListItemButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { selectAllRunResult } from '../runResults/service/runResultSlice'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
// import { useNavigate } from 'react-router-dom'

export default function RunHistoryPage() {
  const allRunResults = useSelector(selectAllRunResult)
  const { workspaceId } = useParams()
  const navigate = useNavigate()

  const handleRunResult = (runResultId: string) => {
    navigate(`/workspaces/${workspaceId}/runResult/${runResultId}`)
  }

  return (
    <Box>
      <Container sx={{ ml: 20 }}>
        <Box sx={{ mt: 2.2 }}>Run History</Box>
        <Box sx={{ mt: 10, ml: 19 }}>
          <Typography variant="h4" gutterBottom>
            Run History
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please click on one item to check its run details.
          </Typography>
        </Box>
        <Box sx={{}}>
          <TableContainer component={Paper} sx={{ mt: 5, width: 900, ml: 18 }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <Box sx={{ display: 'flex', ml: 1 }}>
                    <Box>
                      <TableCell>Date/Time</TableCell>
                    </Box>
                    <Box sx={{ ml: 18 }}>
                      <TableCell align="left">Run Target</TableCell>
                    </Box>
                  </Box>
                  <Divider />
                </TableRow>
              </TableHead>
              <TableBody>
                {allRunResults.map((runResult) => (
                  <Box>
                    <ListItemButton
                      key={runResult.id}
                      onClick={() => handleRunResult(runResult.id)}
                    >
                      {new Date(runResult.created).toLocaleString()}
                      <Box sx={{ ml: 8 }}>{runResult.title}</Box>
                    </ListItemButton>
                    <Divider />
                  </Box>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box sx={{ mt: 3 }}></Box>
      </Container>
    </Box>
  )
}
