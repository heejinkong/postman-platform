import { MenuItem, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useAppSelector } from '../../../app/hook'
import { deleteCollectionById, selectCollectionById } from '../collectionsSlice'
import { deleteFolderById, selectAllFolders } from '../../folders/foldersSlice'
import { deleteRequestById, selectAllRequests } from '../../requests/requestsSlice'
import { useNavigate } from 'react-router-dom'
import { selectWorkspaceById, updateWorkspace } from '../../workspaces/workspacesSlice'

type deleteCollectionMenuItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function DeleteCollectionMenuItem(props: deleteCollectionMenuItemProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))
  const workspace = useAppSelector((state) =>
    selectWorkspaceById(state, collection?.workspaceId ?? '')
  )
  const allFolders = useAppSelector(selectAllFolders)
  const allRequests = useAppSelector(selectAllRequests)

  const handleDelete = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    dispatch(deleteCollectionById(collection.id))

    //workspace의 collections 배열에서 collection.id를 찾아서 삭제
    const cloned = JSON.parse(JSON.stringify(workspace))
    cloned.collections = cloned.collections.filter((id: string) => id !== collection.id)
    dispatch(updateWorkspace(cloned))

    // collection의 folders 배열에서 folder.id를 찾아서 삭제
    const folderList = allFolders.filter((folder) => folder.parentId === collection.id)
    folderList.map((folder) => dispatch(deleteFolderById(folder.id)))

    // collection의 requests 배열에서 request.id를 찾아서 삭제
    const requestList = allRequests.filter((request) => request.parentId === collection.id)
    requestList.map((request) => dispatch(deleteRequestById(request.id)))

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
