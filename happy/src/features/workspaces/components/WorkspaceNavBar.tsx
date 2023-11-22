import Breadcrumbs from '@mui/material/Breadcrumbs'
import { useAppSelector } from '../../../app/hook'
import { selectNavBarExpanded } from '../../config/configSlice'
import WorkspaceNavBarItem from './WorkspaceNavBarItem'
import { Box, Divider } from '@mui/material'

export default function WorkspaceNavBar() {
  const expanded = [...useAppSelector(selectNavBarExpanded)].reverse()

  return (
    <Box>
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        {expanded.map((_id) => (
          <WorkspaceNavBarItem key={_id} _id={_id} />
        ))}
      </Breadcrumbs>
      <Box sx={{ pt: 1 }}>
        <Divider />
      </Box>
    </Box>
  )
}
