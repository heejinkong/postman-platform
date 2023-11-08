import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { useParams } from 'react-router-dom'
import { selectFolderById, updateFolder } from './foldersSlice'
import { folderItem } from './folderItem'

export default function FoldersPage() {
  const { folderId } = useParams()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const dispatch = useAppDispatch()
  const folder = useAppSelector((state) => selectFolderById(state, folderId ?? ''))

  useEffect(() => {
    if (folderId === `:folderId`) {
      setTitle('')
      setDesc('')
    }
  }, [folderId, dispatch])

  const handleUpdateClick = () => {
    const cloned: folderItem = JSON.parse(JSON.stringify(folder))
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
        <Button variant="contained" size="large" onClick={handleUpdateClick}>
          Update
        </Button>
      </Box>
    </Box>
  )
}
