import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function RunResultLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
