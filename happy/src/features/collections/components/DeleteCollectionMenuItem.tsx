import { MenuItem, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById } from '../collectionsSlice'
import { useNavigate } from 'react-router-dom'
import collectionService from '../service/collectionService'

type deleteCollectionMenuItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function DeleteCollectionMenuItem(props: deleteCollectionMenuItemProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    dispatch(collectionService.delete(collection))

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
