import { MenuItem, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById, updateCollection } from '../../collections/collectionsSlice'
import { createFolder, selectFolderById, updateFolder } from '../foldersSlice'
import { collectionItem } from '../../collections/collectionItem'
import { folderItem } from '../folderItem'

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

  //TODO: parent가 없으면 page Notfound 페이지로 이동
  if (!parent) {
    navigate('/NotFound')
  }

  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    console.log('handleClick')
    props.handleClose(e)

    const newFolder: folderItem = new folderItem()
    newFolder.title = 'New Folder'
    newFolder.parentId = parent.id
    newFolder.workspaceId = parent.workspaceId
    dispatch(createFolder(newFolder))

    if (collection) {
      const cloned = JSON.parse(JSON.stringify(collection)) as collectionItem
      cloned.folders.push(newFolder.id)
      cloned.updated = Date.now()
      dispatch(updateCollection(cloned))
      console.log('collection', cloned.id)
    } else if (folder) {
      const cloned = JSON.parse(JSON.stringify(folder)) as folderItem
      cloned.folders.push(newFolder.id)
      cloned.updated = Date.now()
      dispatch(updateFolder(cloned))
      console.log('folder', cloned.id)
    }
    navigate(`/workspaces/${newFolder.workspaceId}/folders/${newFolder.id}`)
  }

  return (
    <MenuItem onClick={(e) => handleClick(e)}>
      <Typography textAlign="center">Add Folder</Typography>
    </MenuItem>
  )
}
