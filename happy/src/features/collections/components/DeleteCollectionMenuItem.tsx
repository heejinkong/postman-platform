import { MenuItem, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../app/hook'
import { deleteCollectionById, selectCollectionById } from '../collectionsSlice'
import { deleteFolderById, selectAllFolders } from '../../folders/foldersSlice'
import { deleteRequestById, selectAllRequests } from '../../requests/requestsSlice'
import { useNavigate } from 'react-router-dom'

type deleteCollectionMenuItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function DeleteCollectionMenuItem(props: deleteCollectionMenuItemProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))

  const allFolders = useAppSelector(selectAllFolders)
  const allRequests = useAppSelector(selectAllRequests)

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    dispatch(deleteCollectionById(collection.id))

    const folderList = allFolders.filter((folder) => folder.parentId === collection.id)
    folderList.map((folder) => dispatch(deleteFolderById(folder.id)))

    const requestListByCollection = allRequests.filter(
      (request) => request.parentId === collection.id
    )
    requestListByCollection.map((request) => dispatch(deleteRequestById(request.id)))

    const requestListByFolder = allFolders.map((folder) =>
      allRequests.filter((request) => request.parentId === folder.id)
    )
    requestListByFolder.map((requestList) =>
      requestList.map((request) => dispatch(deleteRequestById(request.id)))
    )

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
