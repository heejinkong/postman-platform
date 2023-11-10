import { MenuItem, Typography } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../../app/hook'
import { deleteFolderById, selectAllFolders, selectFolderById, updateFolder } from '../foldersSlice'
import React from 'react'
import { deleteRequestById } from '../../requests/requestsSlice'
import { selectCollectionById, updateCollection } from '../../collections/collectionsSlice'

type deleteFolderMenuItemProps = {
  folderId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function DeleteFolderMenuItem(props: deleteFolderMenuItemProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const folder = useAppSelector((state) => selectFolderById(state, props.folderId))
  const collection = useAppSelector((state) => selectCollectionById(state, folder?.parentId ?? ''))

  const allFolders = useAppSelector(selectAllFolders)
  const allRequests = useAppSelector(selectAllFolders)

  const handleDeleteFolder = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)
    console.log('handleDeleteFolder', folder.id)

    dispatch(deleteFolderById(folder.id))

    //collection의 folders 배열에서 folder.id를 찾아서 삭제
    const clonedCollection = JSON.parse(JSON.stringify(collection))
    clonedCollection.folders = clonedCollection.folders.filter((id: string) => id !== folder.id)
    dispatch(updateCollection(clonedCollection))

    //folder의 folders 배열에서 folder.id를 찾아서 삭제
    const clonedFolder = JSON.parse(JSON.stringify(folder))
    clonedFolder.folders = clonedFolder.folders.filter((id: string) => id !== folder.id)
    dispatch(updateFolder(clonedFolder))

    //folder의 requests ㅂ열에서 request.id를 찾아서 삭제
    const requestList = allRequests.filter((request) => request.parentId === folder.id)
    requestList.map((request) => dispatch(deleteRequestById(request.id)))

    //ToDo: folder의 folders 배열에서 folder.id를 찾아서 삭제

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