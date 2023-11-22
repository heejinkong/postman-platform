import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function FolderLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}
