import Breadcrumbs from '@mui/material/Breadcrumbs'
import { useAppSelector } from '../../../app/hook'
import { selectNavBarExpanded } from '../../config/configSlice'
import WorkspaceNavBarItem from './WorkspaceNavBarItem'

export default function WorkspaceNavBar() {
  const expanded = [...useAppSelector(selectNavBarExpanded)].reverse()

  return (
    <div role="presentation">
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        {expanded.map((_id) => (
          <WorkspaceNavBarItem key={_id} _id={_id} />
        ))}
      </Breadcrumbs>
    </div>
  )
}
