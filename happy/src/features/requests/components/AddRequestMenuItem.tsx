import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById } from '../../collections/service/collectionsSlice'
import { selectFolderById } from '../../folders/service/foldersSlice'
import { requestItem } from '../domain/requestEntity'
import { collectionItem } from '../../collections/domain/collectionEntity'
import { folderItem } from '../../folders/domain/folderEntity'
import { useNavigate } from 'react-router-dom'
import { MenuItem, Typography } from '@mui/material'
import requestService from '../service/requestService'

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
  if (!parent) {
    navigate('/NotFound')
  }

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    const newItem = new requestItem()
    newItem.title = 'New Request'
    newItem.parentId = parent.id
    newItem.workspaceId = parent.workspaceId
    dispatch(requestService.new(newItem))

    navigate(`/workspaces/${newItem.workspaceId}/requests/${newItem.id}`)
  }

  return (
    <MenuItem onClick={(e) => handleClick(e)}>
      <Typography textAlign="center">Add Request</Typography>
    </MenuItem>
  )
}
