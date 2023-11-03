import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { Collection } from './collection'
import { create, selectCollectionById, update } from './collectionsSlice'
import { useParams } from 'react-router-dom'

export default function CollectionsPage() {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const dispatch = useAppDispatch()
  const { workspaceId, collectionId } = useParams()

  const collection = useAppSelector((state) =>
    selectCollectionById(state, parseInt(collectionId ?? ''))
  )

  const handleSaveClick = () => {
    const collection: Collection = {
      id: 0,
      title: title,
      desc: desc,
      created: new Date().getTime(),
      updated: new Date().getTime(),
      author: 'admin',
      author_id: 0,
      parent_id: parseInt(workspaceId ?? ''),
      requests: []
    }
    dispatch(create(collection))
    console.log('workspaceid', workspaceId)
  }

  const handleUpdateClick = () => {
    const cloned = Object.assign({}, collection)
    cloned.title = title
    cloned.desc = desc
    cloned.updated = new Date().getTime()
    dispatch(update(cloned))
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
        {collectionId === ':Id' ? (
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
