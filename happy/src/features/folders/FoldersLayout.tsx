import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export default function FoldersLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  )
}
