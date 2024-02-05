import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById } from '../../collections/service/collectionSlice'
import { selectFolderById } from '../../folders/service/folderSlice'
import { requestItem } from '../domain/requestItem'
import { collectionItem } from '../../collections/domain/collectionItem'
import { folderItem } from '../../folders/domain/folderItem'
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

    // console.log(parent.id)
    // console.log(parent.workspaceId)

    const newItem = new requestItem()
    newItem.title = 'New Request'
    newItem.parentId = parent.id
    newItem.workspaceId = parent.workspaceId
    dispatch(requestService.new(newItem))

    navigate(`/workspaces/${newItem.workspaceId}/requests/${newItem.id}`)
  }

  return (
    /* CollectionTreeItem의 메뉴 버튼 클릭 시, AddRequestMenuItem 렌더링 */
    <MenuItem onClick={(e) => handleClick(e)}>
      {/* Add Request 버튼 클릭 시, 새로운 request 생성 */}
      <Typography textAlign="center">Add Request</Typography>
    </MenuItem>
  )
}
