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
import { runResultItem } from '../runResults/domain/runResultItem'
import runResultService from '../runResults/service/runResultService'
import { useState } from 'react'
import { styled } from '@mui/system'
import { useAppDispatch } from '../../app/hook'
import { ListItemDecorator } from '@mui/joy'
// import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'

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

  const NavBarBox = styled(Box)({
    '&.NavBarBox': {
      padding: '12px 16px 0 16px',
      '& nav': {
        height: '22px'
      },
      '& a': {
        fontSize: '14px'
      },
      '& > .NavBarBoxDivider': {
        marginTop: '12px'
      }
    }
  })

  const StyledContainer = styled(Container)({
    '&.StyledContainer': {
      padding: '0 16px',
      maxWidth: '100%'
    }
  })

  return (
    /* Workspace option에서 run history 클릭 시, 해당 workspace의 run history를 보여줌 */
    <Box>
      {/* RunHistoryPage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <NavBarBox className="NavBarBox">
        Run History
        <Box className="NavBarBoxDivider">
          <Divider />
        </Box>
      </NavBarBox>
      <StyledContainer className="StyledContainer">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '54px' }}>
          <Box
            sx={{
              maxWidth: '868px',
              width: '100%'
            }}
          >
            {/* RunHistoryPage의 문구 */}
            <Box sx={{ pb: '60px' }}>
              <Typography variant="h4" sx={{ pb: '12px', fontSize: '24px', fontWeight: 700 }}>
                Run History
              </Typography>
              <Typography variant="subtitle1" color="rgba(rgba(0, 0, 0, 0.6)">
                Please click on one item to check its run details.
              </Typography>
            </Box>
            {/* RunHistoryPage에서  run을 실행한 결과를 리스트 형태로 표시 */}
            <Box
              sx={{
                maxHeight: '704px',
                height: '704px'
              }}
            >
              {allRunResults.length > 0 && (
                //실행결과가 있을 경우, 실행결과를 리스트 형태로 표시
                <List
                  sx={{ pb: 0 }}
                  subheader={
                    <ListItem
                      alignItems="flex-start"
                      sx={{
                        backgroundColor: '#FAFAFB',
                        borderColor: '#E0E1E3',
                        borderStyle: 'solid',
                        borderWidth: 0,
                        borderTopWidth: '1px',
                        borderBottomWidth: '1px',
                        height: '54px',
                        alignItems: 'center'
                      }}
                    >
                      {/* 실행결과의 날짜와 시간을 표시 */}
                      <ListItemDecorator sx={{ width: '10.5rem', mr: '24px' }}>
                        <ListItemText
                          secondary="Date/Time"
                          secondaryTypographyProps={{ style: { fontSize: '12px' } }}
                        />
                      </ListItemDecorator>
                      {/* 실행결과의 title 표시 */}
                      <ListItemText
                        secondary="Run Target"
                        secondaryTypographyProps={{ style: { fontSize: '12px' } }}
                      />
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
                      <ListItemButton
                        key={runResult.id}
                        onClick={() => handleRunResult(runResult.id)}
                        sx={{
                          padding: '16px',
                          borderBottom: '1px solid #E0E1E3',
                          '&:hover': { background: 'rgba(0, 0, 0, .06) !important' },
                          '&:active': { background: 'rgba(0, 0, 0, 0.12)' }
                        }}
                      >
                        <ListItemDecorator sx={{ width: '10.5rem', mr: '24px' }}>
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
                  <Typography variant="h5" sx={{ fontSize: '20px' }}>
                    Run History does not exist
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: '14px', marginTop: '8px' }}
                  >
                    You can run all items in the workspace using the button below
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </StyledContainer>
      {/* RunHistoryPage 하단에 Pagination 표시 (리스트 10개로 정렬) */}
      <Box>
        <Pagination
          count={totalPages}
          shape="rounded"
          page={currentPage}
          onChange={(e, page) => handlePageChange(e, page)}
          sx={{ display: 'flex', justifyContent: 'center', pb: 1.5, pt: 0.75, mt: '36px' }}
        />
      </Box>
    </Box>
  )
}
