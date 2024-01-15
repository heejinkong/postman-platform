import { MenuItem, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById } from '../../collections/service/collectionSlice'
import { selectFolderById } from '../service/folderSlice'
import { collectionItem } from '../../collections/domain/collectionItem'
import { folderItem } from '../domain/folderItem'
import folderService from '../service/folderService'

type addFolderMenuItemProps = {
  parentId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function AddFolderMenuItem(props: addFolderMenuItemProps) {
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

    const newItem = new folderItem()
    newItem.title = 'New Folder'
    newItem.parentId = parent.id
    newItem.workspaceId = parent.workspaceId
    dispatch(folderService.new(newItem))

    navigate(`/workspaces/${newItem.workspaceId}/folders/${newItem.id}`)
  }

  return (
    /* CollectionTreeItem의 메뉴 버튼 클릭 시, AddFolderMenuItem 렌더링 */
    <MenuItem onClick={(e) => handleClick(e)}>
      {/* Add Folder 버튼 클릭 시, 새로운 folder 생성 */}
      <Typography textAlign="center">Add Folder</Typography>
    </MenuItem>
  )
}
