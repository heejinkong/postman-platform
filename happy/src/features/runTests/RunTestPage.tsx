import { Box, Breadcrumbs, Container, Divider, Grid, Link, List, Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { selectAllRunTests } from './runTestSlice'
import ViewResult from './component/ViewResult'
import { runResultItem } from '../runResults/runResultItem'

type runResultPageProps = {
  parent: runResultItem
}

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault()
  console.info('You clicked a breadcrumb.')
}

export default function RunTestPage(props: runResultPageProps) {
  //parent.runTestList에 속한 runTest들을 모두 가져온다.
  const allRunTests = useSelector(selectAllRunTests).filter((runTest) => {
    return props.parent.runTestList?.includes(runTest.id) ?? false
  })

  return (
    <Container
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10
      }}
    >
      {/* <Divider sx={{ my: 0.5 }} /> */}
      <List sx={{ width: '100%', maxWidth: 900, mt: 10 }}>
        {allRunTests.map((runTest) => (
          <Box sx={{ display: 'flex', mt: 1 }}>
            <Box>
              <Grid item xs={9}>
                {(runTest.status === 200 && runTest.expected === '') ||
                (runTest.status === 200 && runTest.expected === runTest.result) ? (
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
                <div role="presentation" onClick={handleClick}>
                  <Breadcrumbs aria-label="breadcrumb">
                    <Link
                      underline="hover"
                      color="inherit"
                      href="/material-ui/getting-started/installation/"
                    >
                      workspace
                    </Link>
                    <Link underline="hover" color="inherit" href="/">
                      {runTest.title}
                    </Link>
                  </Breadcrumbs>
                </div>
              </Grid>
            </Box>
            <Box sx={{ mt: 2, ml: 45 }}>
              <Grid item xs={3}>
                <ViewResult response={runTest.result} expected={runTest.expected} />
              </Grid>
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
      </List>
    </Container>
  )
}
