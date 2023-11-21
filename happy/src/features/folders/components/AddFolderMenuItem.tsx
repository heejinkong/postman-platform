import { MenuItem, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById } from '../../collections/service/collectionsSlice'
import { selectFolderById } from '../service/foldersSlice'
import { collectionItem } from '../../collections/domain/collectionEntity'
import { folderItem } from '../domain/folderEntity'
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
    <MenuItem onClick={(e) => handleClick(e)}>
      <Typography textAlign="center">Add Folder</Typography>
    </MenuItem>
  )
}
