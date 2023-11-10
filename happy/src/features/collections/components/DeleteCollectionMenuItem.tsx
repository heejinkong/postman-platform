import { MenuItem, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById } from '../collectionsSlice'
import { useNavigate } from 'react-router-dom'
import { selectWorkspaceById } from '../../workspaces/workspacesSlice'
import { deleteCollection } from '../service/collectionService'

type deleteCollectionMenuItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function DeleteCollectionMenuItem(props: deleteCollectionMenuItemProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))
  const workspace = useAppSelector((state) =>
    selectWorkspaceById(state, collection?.workspaceId ?? '')
  )

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    dispatch(deleteCollection({ collection: collection, parent: workspace }))

    navigate(`/workspaces/${collection.workspaceId}`)
  }

  return (
    <MenuItem onClick={(e) => handleDelete(e)}>
      <Typography textAlign="center" sx={{ color: `#d32e2e` }}>
        Delete
      </Typography>
    </MenuItem>
  )
}
