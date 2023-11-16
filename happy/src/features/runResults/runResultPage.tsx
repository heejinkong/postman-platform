import { Box, Container, Divider, Typography } from '@mui/material'
import RunTestPage from '../runTests/RunTestPage'

export default function RunResultPage() {
  return (
    <Container sx={{ ml: 35 }}>
      <Box sx={{ mt: 4 }}>Run Result</Box>
      <Divider />
      <Box sx={{ mt: 12, ml: 26 }}>
        <Typography variant="h4" gutterBottom>
          Run Results
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please click on one item to check its run details.
        </Typography>
        <Divider sx={{ my: 10 }} />
      </Box>
      <Box sx={{ mt: -20 }}>
        <RunTestPage />
      </Box>
      <Box sx={{ mt: 3 }}></Box>
    </Container>
  )
}
