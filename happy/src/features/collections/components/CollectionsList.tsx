import List from '@mui/material/List'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import { selectAllCollections } from '../collectionsSlice'
import CollectionsListItem from './CollectionsListItem'

export default function CollectionsList() {
  const { workspaceId } = useParams()

  const allCollections = useAppSelector(selectAllCollections)
  const collectionList = allCollections.filter((c) => c.parentId === workspaceId)

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }} component="nav">
      {collectionList.map((c) => (
        <CollectionsListItem key={c.id} collectionId={c.id} />
      ))}
    </List>
  )
}
