import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById, updateCollection } from '../../collections/collectionsSlice'
import { selectFolderById, updateFolder } from '../../folders/foldersSlice'
import { requestItem } from '../requestItem'
import { createRequest } from '../requestsSlice'
import { collectionItem } from '../../collections/collectionItem'
import { folderItem } from '../../folders/folderItem'
import { useNavigate } from 'react-router-dom'
import { MenuItem, Typography } from '@mui/material'

type addRequestMenuItemProps = {
  parentId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function AddRequestMenuItem(props: addRequestMenuItemProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const collection = useAppSelector((state) => selectCollectionById(state, props.parentId))
  const folder = useAppSelector((state) => selectFolderById(state, props.parentId))
  const parent: collectionItem | folderItem = collection ?? folder

  //TODO: parent가 없으면 page Notfound 페이지로 이동
  if (!parent) {
    navigate('/NotFound')
  }

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)
    console.log('handleClick', parent)
    const newRequest: requestItem = new requestItem()
    newRequest.title = 'New Request'
    newRequest.parentId = parent.id
    newRequest.workspaceId = parent.workspaceId
    dispatch(createRequest(newRequest))

    if (collection) {
      const cloned = JSON.parse(JSON.stringify(collection)) as collectionItem
      cloned.requests.push(newRequest.id)
      cloned.updated = Date.now()
      dispatch(updateCollection(cloned))
    } else if (folder) {
      const cloned = JSON.parse(JSON.stringify(folder)) as folderItem
      cloned.requests.push(newRequest.id)
      cloned.updated = Date.now()
      dispatch(updateFolder(cloned))
    }

    navigate(`/workspaces/${newRequest.workspaceId}/requests/${newRequest.id}`)
  }

  return (
    <MenuItem onClick={(e) => handleClick(e)}>
      <Typography textAlign="center">Add Request</Typography>
    </MenuItem>
  )
}
