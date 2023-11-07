import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { collectionItem } from './collectionItem'
import { createCollection, selectCollectionById, updateCollection } from './collectionsSlice'
import { useParams } from 'react-router-dom'
import { selectWorkspaceById, updateWorkspace } from '../workspaces/workspacesSlice'

export default function CollectionsPage() {
  const { workspaceId, collectionId } = useParams()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const dispatch = useAppDispatch()
  const collection = useAppSelector((state) => selectCollectionById(state, collectionId ?? ''))
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))

  useEffect(() => {
    if (collectionId === `:collectionId`) {
      setTitle('')
      setDesc('')
    }
  }, [collectionId, dispatch])

  const handleSaveClick = () => {
    const newCollection: collectionItem = {
      id: '',
      title: title,
      desc: desc,
      created: Date.now(),
      updated: Date.now(),
      authorId: 'admin',
      parentId: workspace.id,
      requests: [],
      folders: []
    }
    dispatch(createCollection(newCollection))

    // workspace의 collections에 추가
    const cloned = JSON.parse(JSON.stringify(workspace))
    cloned.collections.push(newCollection.id)
    cloned.updated = Date.now()
    dispatch(updateWorkspace(cloned))
  }

  const handleUpdateClick = () => {
    const cloned = JSON.parse(JSON.stringify(collection))
    cloned.title = title
    cloned.desc = desc
    cloned.updated = Date.now()
    dispatch(updateCollection(cloned))
  }

  useEffect(() => {
    if (!collection) {
      return
    }

    setTitle(collection.title)
    setDesc(collection.desc)
  }, [collection])

  return (
    <Box>
      <Box>
        <Typography variant="h3" gutterBottom>
          Collection
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
        {collectionId === `:collectionId` ? (
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
