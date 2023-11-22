import Box from '@mui/material/Box'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import { TreeView } from '@mui/x-tree-view/TreeView'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectWorkspaceById } from '../service/workspaceSlice'
import CollectionTreeItem from '../../collections/components/CollectionTreeItem'
import {
  configAction,
  selectNavTreeExpanded,
  selectNavTreeSelected
} from '../../config/configSlice'

export default function WorkspaceNavTree() {
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  const dispatch = useAppDispatch()
  const selected = useAppSelector(selectNavTreeSelected)
  const expanded = useAppSelector(selectNavTreeExpanded)
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))
  if (!workspace) {
    navigate('/NotFoundPage')
    return <></>
  }

  const handleToggle = (_event: React.SyntheticEvent, nodeIds: string[]) => {
    dispatch(configAction.setNavTreeExpanded(nodeIds))
  }
  const handleSelect = (_event: React.SyntheticEvent, nodeId: string) => {
    dispatch(configAction.setNavTreeSelected(nodeId))
  }

  const renderCollectionTree = (collections: string[]) =>
    collections.map((id) => <CollectionTreeItem key={id} _id={id} />)

  return (
    <Box sx={{ minWidth: 280 }}>
      <TreeView
        aria-label="rich object"
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
        selected={selected}
        expanded={expanded}
        onNodeToggle={handleToggle}
        onNodeSelect={handleSelect}
      >
        {renderCollectionTree(workspace.collections)}
      </TreeView>
    </Box>
  )
}
