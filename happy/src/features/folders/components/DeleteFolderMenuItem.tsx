import { MenuItem, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import React from 'react'
import folderService from '../service/folderService'
import { selectFolderById } from '../service/folderSlice'

type deleteFolderMenuItemProps = {
  folderId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function DeleteFolderMenuItem(props: deleteFolderMenuItemProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const folder = useAppSelector((state) => selectFolderById(state, props.folderId))

  const handleDeleteFolder = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    dispatch(folderService.delete(folder))

    navigate(`/workspaces/${folder.workspaceId}`)
  }

  return (
    <MenuItem onClick={handleDeleteFolder}>
      {/* Delete 버튼 클릭 시, 해당 folder 삭제 */}
      <Typography textAlign="center" sx={{ color: `#d32e2e` }}>
        Delete
      </Typography>
    </MenuItem>
  )
}
