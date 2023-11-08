import { IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createCollection } from '../collectionsSlice'
import { useAppSelector } from '../../../app/hook'
import { selectWorkspaceById, updateWorkspace } from '../../workspaces/workspacesSlice'
import { workspaceItem } from '../../workspaces/workspaceItem'
import { collectionItem } from '../collectionItem'

export default function NewCollection() {
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  const dispatch = useDispatch()

  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))

  // TODO : workspace가 없을 때 예외처리

  const handleNewCollectionClick = () => {
    const newCollection: collectionItem = {
      id: '',
      title: 'New Collection',
      desc: '',
      created: Date.now(),
      updated: Date.now(),
      authorId: 'admin',
      workspaceId: workspaceId ?? '',
      requests: [],
      folders: []
    }
    dispatch(createCollection(newCollection))

    const cloned: workspaceItem = JSON.parse(JSON.stringify(workspace))
    cloned.collections.push(newCollection.id)
    cloned.updated = Date.now()
    dispatch(updateWorkspace(cloned))

    navigate(`/workspaces/${workspaceId}/collections/${newCollection.id}`)
  }

  return (
    <IconButton aria-label="newcollection" onClick={handleNewCollectionClick}>
      <AddIcon />
    </IconButton>
  )
}
