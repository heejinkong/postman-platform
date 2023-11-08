import { MenuItem, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import { deleteFolderById, selectAllFolders, selectFolderById } from '../foldersSlice'
import React from 'react'
import { deleteRequestById } from '../../requests/requestsSlice'

type deleteFolderMenuItemProps = {
  folderId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function DeleteFolderMenuItem(props: deleteFolderMenuItemProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const folder = useAppSelector((state) => selectFolderById(state, props.folderId))

  const allFolders = useAppSelector(selectAllFolders)
  const allRequests = useAppSelector(selectAllFolders)

  const handleDeleteFolder = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    dispatch(deleteFolderById(folder.id))

    const folderList = allFolders.filter((folder) => folder.parentId === folder.id)
    folderList.map((folder) => dispatch(deleteFolderById(folder.id)))

    const requestListByFolder = allRequests.filter((request) => request.parentId === folder.id)
    requestListByFolder.map((request) => dispatch(deleteRequestById(request.id)))

    navigate(`/workspaces/${folder.workspaceId}/collections/${folder.parentId}`)
  }

  return (
    <MenuItem onClick={handleDeleteFolder}>
      <Typography textAlign="center" sx={{ color: `#d32e2e` }}>
        Delete
      </Typography>
    </MenuItem>
  )
}
