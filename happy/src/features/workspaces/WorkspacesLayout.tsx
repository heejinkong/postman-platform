import { Box, Container } from '@mui/material'
import { Outlet } from 'react-router-dom'
import NavBar from './components/NavBar'

export default function WorkspacesLayout() {
  return (
    <Container>
      <NavBar />
      <Box sx={{ mt: 5 }}>
        <Outlet />
      </Box>
    </Container>
  )
}
