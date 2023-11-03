import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function CollectionsLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}
