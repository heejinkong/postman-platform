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
    /* Workspace option에서 run history 클릭 시, 해당 workspace의 run history를 보여줌 */
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* RunHistoryPage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <Box sx={{ px: 1, py: 0.75 }}>
        <WorkspaceNavBar _id={workspaceId ?? ''} />
      </Box>
      <Divider />
      <Container sx={{ pt: 3, flexGrow: 1 }}>
        {/* RunHistoryPage의 문구 */}
        <Box sx={{ pb: 3.75 }}>
          <Typography variant="h4" sx={{ pb: 0.75 }}>
            Run History
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Please click on one item to check its run details.
          </Typography>
        </Box>
        {/* RunHistoryPage에서  run을 실행한 결과를 리스트 형태로 표시 */}
        <Box sx={{ pb: 5 }}>
          {allRunResults.length > 0 && (
            //실행결과가 있을 경우, 실행결과를 리스트 형태로 표시
            <List
              subheader={
                <ListItem alignItems="flex-start" sx={{ backgroundColor: 'action.hover' }}>
                  {/* 실행결과의 날짜와 시간을 표시 */}
                  <ListItemDecorator sx={{ width: '10.5rem', mr: 1.5 }}>
                    <ListItemText secondary="Date/Time" />
                  </ListItemDecorator>
                  {/* 실행결과의 title 표시 */}
                  <ListItemText secondary="Run Target" />
                </ListItem>
              }
            >
              {currentRows.map((runResult) => (
                <ListItem
                  key={runResult.id}
                  alignItems="flex-start"
                  disablePadding
                  secondaryAction={
                    // 실행결과의 삭제 버튼 표시
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => handleDeleteClick(e, runResult)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  {/* 리스트 클릭 시, 해당 실행결과의 상세 내용 페이지(RunResultPage)로 이동 */}
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
            //실행결과가 없을 경우, 문구 표시
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
      {/* RunHistoryPage 하단에 Pagination 표시 (리스트 10개로 정렬) */}
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
