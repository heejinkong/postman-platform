import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';

export default function CollectionLayout() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
