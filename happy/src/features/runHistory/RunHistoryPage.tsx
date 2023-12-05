import {
  Box,
  Container,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
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
import { ListItemDecorator } from '@mui/joy'
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'

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

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 1, py: 0.75 }}>
        <WorkspaceNavBar />
      </Box>
      <Divider />
      <Container sx={{ pt: 3, flexGrow: 1 }}>
        <Box sx={{ pb: 3.75 }}>
          <Typography variant="h4" sx={{ pb: 0.75 }}>
            Run History
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Please click on one item to check its run details.
          </Typography>
        </Box>
        <Box sx={{ pb: 5 }}>
          {allRunResults.length > 0 && (
            <List
              subheader={
                <ListItem alignItems="flex-start" sx={{ backgroundColor: 'action.hover' }}>
                  <ListItemDecorator sx={{ width: '10.5rem', mr: 1.5 }}>
                    <ListItemText secondary="Date/Time" />
                  </ListItemDecorator>
                  <ListItemText secondary="Run Target" />
                </ListItem>
              }
            >
              {currentRows.map((runResult) => (
                <ListItem
                  alignItems="flex-start"
                  disablePadding
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => handleDeleteClick(e, runResult)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton key={runResult.id} onClick={() => handleRunResult(runResult.id)}>
                    <ListItemDecorator sx={{ width: '10.5rem', mr: 1.5 }}>
                      <ListItemText secondary={new Date(runResult.created).toLocaleString()} />
                    </ListItemDecorator>
                    <ListItemText primary={runResult.title} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
          {allRunResults.length === 0 && (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                pb: 5
              }}
            >
              <Typography variant="h5">Run History does not exist</Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                You can run all items in the workspace using the button below
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
      <Box>
        <Pagination
          count={totalPages}
          shape="rounded"
          page={currentPage}
          onChange={(e, page) => handlePageChange(e, page)}
          sx={{ display: 'flex', justifyContent: 'center', pb: 1.5, pt: 0.75 }}
        />
      </Box>
    </Box>
  )
}
