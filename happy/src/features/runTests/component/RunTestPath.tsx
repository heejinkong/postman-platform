import { Box, Breadcrumbs } from '@mui/material'
import { useAppSelector } from '../../../app/hook'
import { selectPathExpanded } from '../../path/pathSlice'
import RunTestPathItem from './RunTestPathItem'

// type RunTestPathProps = {
//   id: string
// }

export default function RunTestPath() {
  const expanded = [...useAppSelector(selectPathExpanded)].reverse()
  return (
    <Box>
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        {expanded.map((id) => (
          <RunTestPathItem key={id} id={id} />
        ))}
      </Breadcrumbs>
    </Box>
  )
}
