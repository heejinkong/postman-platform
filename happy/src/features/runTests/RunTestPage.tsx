import { Box, Breadcrumbs, Container, Divider, Grid, Link, List, Typography } from '@mui/material'
import { selectAllRunTests } from './service/runTestSlice'
import ViewResult from './component/ViewResult'
import { runResultItem } from '../runResults/domain/runResultEntity'
import { useAppSelector } from '../../app/hook'
import { selectWorkspaceById } from '../workspaces/service/workspaceSlice'

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
    <Container
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <List sx={{ width: '100%', maxWidth: 900, mt: 10 }}>
        <Box>
          {allRunTests.map((runTest) => (
            <Box sx={{ display: 'flex', mt: 1 }}>
              <Box sx={{ flex: 1 }}>
                <Grid item xs={9}>
                  {(runTest.status === 200 || runTest.status === 201) &&
                  (runTest.expectedResult === '' ||
                    runTest.expectedResult === runTest.responseResult) ? (
                    <Box>
                      <Typography variant="h5" gutterBottom sx={{ color: `#2E7D32` }}>
                        Success
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      {' '}
                      <Typography variant="h5" gutterBottom sx={{ color: `#C62828` }}>
                        Fail
                      </Typography>
                    </Box>
                  )}
                  <div role="presentation">
                    <Breadcrumbs separator="/" aria-label="breadcrumb">
                      <Link underline="hover" color="inherit" href={`/workspaces/${workspace.id}`}>
                        {workspace.title}
                      </Link>

                      <Typography variant="body1" gutterBottom>
                        {props.parent.title}
                      </Typography>

                      <Typography variant="body1" gutterBottom>
                        {runTest.title}
                      </Typography>
                    </Breadcrumbs>
                  </div>
                </Grid>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Grid item xs={3}>
                  <ViewResult
                    title={runTest.title}
                    response={runTest.responseResult}
                    expected={runTest.expectedResult}
                  />
                </Grid>
              </Box>
            </Box>
          ))}
        </Box>
        <Divider sx={{ my: 2 }} />
      </List>
    </Container>
  )
}
