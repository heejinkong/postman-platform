import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function RunTestLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}
