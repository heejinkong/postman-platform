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
import { selectAllRunResult } from '../runResults/service/runResultSlice'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import DeleteIcon from '@mui/icons-material/Delete'
import { runResultItem } from '../runResults/domain/runResultEntity'
import runResultService from '../runResults/service/runResultService'
import { useState } from 'react'
import { useAppDispatch } from '../../app/hook'

export default function RunHistoryPage() {
  const { workspaceId } = useParams()
  const allRunResults = useSelector(selectAllRunResult).filter((runResult) => {
    return runResult.workspaceId === workspaceId
  })
  allRunResults.sort((a, b) => {
    return b.created - a.created
  })
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const rowsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const indexOfLastRow = currentPage * rowsPerPage
  const indexOfFirstRow = indexOfLastRow - rowsPerPage
  const currentRows = allRunResults.slice(indexOfFirstRow, indexOfLastRow)
  const totalPages = Math.ceil(allRunResults.length / rowsPerPage)

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page)
  }

  const handleRunResult = (runResultId: string) => {
    navigate(`/workspaces/${workspaceId}/runResult/${runResultId}`)
  }

  const handleDeleteClick = (e: { stopPropagation: () => void }, runResult: runResultItem) => {
    e.stopPropagation()
    dispatch(runResultService.delete(runResult))
  }

  if (allRunResults.length === 0) {
    return (
      <Box>
        <Container sx={{ ml: 3 }}>
          <Box sx={{ mt: 10, ml: 23 }}>
            <Typography variant="h4" gutterBottom>
              Run History
            </Typography>
            <Typography variant="body1" gutterBottom>
              Please click on one item to check its run details.
            </Typography>
          </Box>
          <Box sx={{ mt: 30, ml: 65 }}>
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Box sx={{ minWidth: 750, p: 3, pb: 15 }}>
          <Box>Run History</Box>
          <Box>
            <Typography variant="h4" gutterBottom>
              Run History
            </Typography>
            <Typography variant="body1" gutterBottom>
              Please click on one item to check its run details.
            </Typography>
          </Box>
          <Box>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <Box sx={{ display: 'flex' }}>
                      <Box sx={{ width: 250 }}>
                        <TableCell>Date/Time</TableCell>
                      </Box>
                      <Box>
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
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '100%'
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex'
                            }}
                          >
                            <Box sx={{ width: 250 }}>
                              {new Date(runResult.created).toLocaleString()}
                            </Box>
                            <Box>{runResult.title}</Box>
                          </Box>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={(e) => handleDeleteClick(e, runResult)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
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
        </Box>
      </Box>
    )
  }
}
