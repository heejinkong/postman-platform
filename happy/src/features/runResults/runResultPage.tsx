import { Box, Container, Divider, Typography } from '@mui/material'
import RunTestPage from '../runTests/RunTestPage'

export default function RunResultPage() {
  return (
    <Container>
      <Box sx={{ mt: 4 }}>Run Result</Box>
      <Divider />
      <Box sx={{ mt: 12, ml: 28 }}>
        <Typography variant="h4" gutterBottom>
          Run Results
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
