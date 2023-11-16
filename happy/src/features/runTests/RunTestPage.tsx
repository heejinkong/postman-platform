import {
  Box,
  Breadcrumbs,
  Button,
  Container,
  Divider,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Typography
} from '@mui/material'
import { useSelector } from 'react-redux'
import { selectAllRunResults } from './service/runTestSlice'
import ViewResult from './component/ViewResult'

function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  event.preventDefault()
  console.info('You clicked a breadcrumb.')
}

export default function RunTestPage() {
  const allRunTests = useSelector(selectAllRunResults)

  const handleResultClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {}

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
          <Box sx={{ display: 'flex', mt: 2 }}>
            <Box>
              {runTest.status === 200 && runTest.expected === runTest.result ? (
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
                  <Link underline="hover" color="inherit" href="/">
                    {runTest.title}
                  </Link>
                  <Link
                    underline="hover"
                    color="inherit"
                    href="/material-ui/getting-started/installation/"
                  >
                    Core
                  </Link>
                  <Typography color="text.primary">Breadcrumbs</Typography>
                </Breadcrumbs>
              </div>
            </Box>
            <Box sx={{ mt: 3, ml: 45 }}>
              <ViewResult response={runTest.result} expected={runTest.expected} />
            </Box>
            <Divider sx={{ my: 2 }} />

            {/* <ListItemText
              primary={runTest.title}
              secondary={new Date(runTest.created).toLocaleString()}
            /> */}
            {/* <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteClick(e, ws)}>
            <DeleteIcon />
            </IconButton> */}
          </Box>
        ))}
        <Divider sx={{ my: 2 }} />
      </List>

      {/* <Box sx={{ width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {allRunTests.map((runTest) => (
              <li key={runTest.id}>{runTest.title}</li>
            ))}
          </Box>
        </Box> */}
    </Container>
  )
}
