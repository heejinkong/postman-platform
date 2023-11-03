import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function RequestsLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}
