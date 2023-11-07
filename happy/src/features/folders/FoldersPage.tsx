import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { useNavigate, useParams } from 'react-router-dom'
import { folderItem } from './folderItem'
import { createFolder, selectFolderById, updateFolder } from './foldersSlice'
import { selectCollectionById, updateCollection } from '../collections/collectionsSlice'

export default function CollectionsPage() {
  const { collectionId, folderId } = useParams()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const dispatch = useAppDispatch()
  const collection = useAppSelector((state) => selectCollectionById(state, collectionId ?? ''))
  const folder = useAppSelector((state) => selectFolderById(state, folderId ?? ''))

  useEffect(() => {
    if (folderId === `:folderId`) {
      setTitle('')
      setDesc('')
    }
  }, [folderId, dispatch])

  const handleSaveClick = () => {
    const newFolder: folderItem = {
      id: '',
      title: title,
      desc: desc,
      created: Date.now(),
      updated: Date.now(),
      authorId: 'admin',
      parentId: collection.id,
      requests: []
    }
    dispatch(createFolder(newFolder))

    // collection의 folders에 추가
    const cloned = JSON.parse(JSON.stringify(collection))
    cloned.folders.push(newFolder.id)
    cloned.updated = Date.now()
    dispatch(updateCollection(cloned))

    navigate(
      `/workspaces/${collection.parentId}/collections/${collection.id}/folders/${newFolder.id}`
    )
  }

  const handleUpdateClick = () => {
    const cloned = JSON.parse(JSON.stringify(folder))
    cloned.title = title
    cloned.desc = desc
    cloned.updated = Date.now()
    dispatch(updateFolder(cloned))
  }

  useEffect(() => {
    if (!folder) {
      return
    }

    setTitle(folder.title)
    setDesc(folder.desc)
  }, [folder])

  return (
    <Box>
      <Box>
        <Typography variant="h3" gutterBottom>
          Folder
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="Collection Name"
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            value={title}
          />
        </Box>
        <Box>
          <TextField
            fullWidth
            id="outlined-multiline-static"
            label="Description"
            multiline
            rows={4}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </Box>
        {folderId === `:folderId` ? (
          <Button variant="contained" size="large" onClick={handleSaveClick}>
            Save
          </Button>
        ) : (
          <Button variant="contained" size="large" onClick={handleUpdateClick}>
            Update
          </Button>
        )}
      </Box>
    </Box>
  )
}
