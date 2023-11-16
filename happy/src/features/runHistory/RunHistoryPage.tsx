import { Box, Container, Typography } from '@mui/material'
import RunTestPage from '../runTests/RunTestPage'

export default function RunHistoryPage() {
  return (
    <Container>
      <Box sx={{ mt: 5 }}>
        <Typography variant="h3" gutterBottom>
          Run History
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please click on one item to check its run details.
        </Typography>
      </Box>
      <Box sx={{ mt: 3 }}>
        <RunTestPage />
      </Box>
      <Box sx={{ mt: 3 }}></Box>
    </Container>
  )
}
