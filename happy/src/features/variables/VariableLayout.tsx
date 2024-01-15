import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function VariableLayout() {
  return (
    <Box sx={{ height: '100%' }}>
      <Outlet />
    </Box>
  )
}
