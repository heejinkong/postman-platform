import { Box } from '@mui/joy'
import IconButton from '@mui/material/IconButton'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import DeleteIcon from '@mui/icons-material/Delete'
import React from 'react'
import { selectCollectionById, updateCollection } from '../../collections/collectionsSlice'
import { deleteFolderById, selectFolderById } from '../foldersSlice'

type folderItemProps = {
  folderId: string
}

export default function FolderListItem(props: folderItemProps) {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const folder = useAppSelector((state) => selectFolderById(state, props.folderId))
  const collection = useAppSelector((state) => selectCollectionById(state, folder?.parentId ?? ''))

  const handleNavRequest = () => {
    navigate(
      `/workspaces/${collection.parentId}/collections/${folder.parentId}/requests/${folder.id}`
    )
  }

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()

    // collection의 folders 배열에서 folder.id를 찾아서 삭제
    const cloned = JSON.parse(JSON.stringify(collection))
    cloned.folders = cloned.folders.filter((id: string) => id !== folder.id)
    dispatch(updateCollection(cloned))

    // request 삭제
    dispatch(deleteFolderById(folder.id))
  }

  if (folder) {
    return (
      <Box>
        <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavRequest()}>
          <ListItemText primary={folder?.title} />
          <IconButton onClick={(e) => handleDeleteClick(e)}>
            <DeleteIcon />
          </IconButton>
        </ListItemButton>
      </Box>
    )
  } else {
    return <></>
  }
}
