import { Box, Container, Divider, Grid, List, Typography } from '@mui/material'
import { selectAllRunTests } from './service/runTestSlice'
import ViewResult from './component/ViewResult'
import { runResultItem } from '../runResults/domain/runResultItem'
import { useAppSelector } from '../../app/hook'
import { selectWorkspaceById } from '../workspaces/service/workspaceSlice'
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'

type runResultPageProps = {
  parent: runResultItem
}

export default function RunTestPage(props: runResultPageProps) {
  const allRunTests = useAppSelector(selectAllRunTests).filter((runTest) => {
    return props.parent.runTestList?.includes(runTest.id) ?? false
  })

  const workspace = useAppSelector((state) =>
    selectWorkspaceById(state, props.parent.workspaceId ?? '')
  )
  if (!workspace) {
    return <></>
  }

  return (
    //RunResultPage에 뿌려줄 데이터들을 RunResultPage에 렌더링
    <Container sx={{ padding: '0 !important ' }}>
      <Box>
        {/* 해당 runTest들을 list로 뿌려줌 */}
        <List sx={{ width: '100%', padding: 0, borderColor: 'rgba(224, 225, 227, 1)' }}>
          <Box sx={{ maxHeight: 620, overflowY: 'auto' }}>
            {allRunTests.map((runTest) => (
              <Box>
                <Divider />
                <Box sx={{ pt: 0.75, pb: 0.5, display: 'flex', maxHeight: 600, overflowY: 'auto' }}>
                  <Box sx={{ flex: 1, pb: 0.5, mr: 1.5 }}>
                    <Grid item xs={9}>
                      {/* runTest의 title과 status를 보여줌 */}
                      {(runTest.status === 200 || runTest.status === 201) &&
                      (runTest.expectedResult === '' ||
                        runTest.expectedResult === runTest.responseResult) ? (
                        // runTest의 status가 200이거나 201이고, expected와 response가 같으면 success
                        <Box>
                          <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ color: `#2E7D32`, fontSize: '16px', mb: '8px' }}
                          >
                            Success
                          </Typography>
                        </Box>
                      ) : (
                        // 그렇지 않으면 fail
                        <Box>
                          {' '}
                          <Typography
                            variant="h5"
                            gutterBottom
                            sx={{ color: `#C62828`, fontSize: '16px', mb: '8px' }}
                          >
                            Fail
                          </Typography>
                        </Box>
                      )}

                      {/* 실행된 request의 path 표시 */}
                      <div role="presentation">
                        <WorkspaceNavBar _id={runTest.requestId ?? ''} />
                      </div>
                    </Grid>
                  </Box>
                  {/* ViewResult 컴포넌트를 통해 응답값 표시 */}
                  <Box sx={{ mt: 2.5, pb: 1, mr: 1 }}>
                    <Grid item xs={3}>
                      <ViewResult
                        title={runTest.title}
                        response={runTest.responseResult}
                        expected={runTest.expectedResult}
                      />
                    </Grid>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </List>
      </Box>
    </Container>
  )
}
