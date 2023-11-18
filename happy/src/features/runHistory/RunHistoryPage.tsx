import {
  Box,
  Container,
  Divider,
  IconButton,
  ListItemButton,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { selectAllRunResult } from '../runResults/runResultSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import { runResultItem } from '../runResults/runResultItem'
import runResultService from '../runResults/service/runResultService'
import { useState } from 'react'

export default function RunHistoryPage() {
  const allRunResults = useSelector(selectAllRunResult).sort((a, b) =>
    a.created < b.created ? 1 : -1
  )
  const { workspaceId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const rowsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = allRunResults.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(allRunResults.length / rowsPerPage)

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const handleRunResult = (runResultId: string) => {
    navigate(`/workspaces/${workspaceId}/runResult/${runResultId}`)
  }

  const handleDeleteClick = (e: { stopPropagation: () => void }, runResult: runResultItem) => {
    e.stopPropagation()
    // dispatch(runResultService.delete(runResult))
  }

  if (allRunResults.length === 0) {
    return (
      <Box>
        <Container sx={{ ml: 20 }}>
          <Box sx={{ mt: 2.2 }}>Run History</Box>
          <Box sx={{ mt: 10, ml: 19 }}>
            <Typography variant="h3" gutterBottom>
              Run History
            </Typography>
            <Typography variant="h6" gutterBottom>
              Please click on one item to check its run details.
            </Typography>
          </Box>
          <Box sx={{ mt: 40, ml: 70 }}>
            <Typography variant="h4" gutterBottom sx={{ ml: 2 }}>
              Run History does not exist
            </Typography>
            <Typography variant="body1" gutterBottom>
              You can run all items in the workspace using the button below
            </Typography>
          </Box>
        </Container>
      </Box>
    )
  } else {
    return (
      <Box>
        <Container sx={{ ml: 40 }}>
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
                      <Box sx={{ ml: 21 }}>
                        <TableCell align="left">Run Target</TableCell>
                      </Box>
                    </Box>
                    <Divider />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {currentRows.map((runResult) => (
                    <Box>
                      <ListItemButton
                        key={runResult.id}
                        onClick={() => handleRunResult(runResult.id)}
                        sx={{ p: 2 }}
                      >
                        {new Date(runResult.created).toLocaleString()}
                        <Box sx={{ ml: 10 }}>{runResult.title}</Box>
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={(e) => handleDeleteClick(e, runResult)}
                          sx={{ ml: 50 }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemButton>
                      <Divider />
                    </Box>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Box sx={{ mt: 5 }}>
            <Pagination
              count={totalPages}
              shape="rounded"
              page={currentPage}
              onChange={(e, page) => handlePageChange(e, page)}
              sx={{ display: 'flex', justifyContent: 'center', pb: 3 }}
            />
          </Box>
        </Container>
      </Box>
    )
  }
}
