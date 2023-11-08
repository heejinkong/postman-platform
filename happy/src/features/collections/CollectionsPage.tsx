import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { selectCollectionById, updateCollection } from './collectionsSlice'
import { useParams } from 'react-router-dom'

export default function CollectionsPage() {
  const { collectionId } = useParams()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const dispatch = useAppDispatch()
  const collection = useAppSelector((state) => selectCollectionById(state, collectionId ?? ''))

  useEffect(() => {
    if (collectionId === `:collectionId`) {
      setTitle('')
      setDesc('')
    }
  }, [collectionId, dispatch])

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

        <Button variant="contained" size="large" onClick={handleUpdateClick}>
          Update
        </Button>
      </Box>
    </Box>
  )
}
