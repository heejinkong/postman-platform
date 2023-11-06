import Box from '@mui/material/Box'
import List from '@mui/material/List'
import SideSubList from './SideSubList'

export default function SideList() {
  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
      <Box>
        <SideSubList />
      </Box>
    </List>
  )
}
