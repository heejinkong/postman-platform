import { Box, Button, Container, Divider, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { selectCollectionById } from './service/collectionSlice'
import { useNavigate, useParams } from 'react-router-dom'
import collectionService from './service/collectionService'
import configService from '../config/service/configService'
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'

export default function CollectionPage() {
  const navigate = useNavigate()
  const { collectionId } = useParams()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const dispatch = useAppDispatch()
  const collection = useAppSelector((state) => selectCollectionById(state, collectionId ?? ''))
  if (!collection) {
    navigate(`/NotFoundPage`)
  }

  const handleUpdateClick = () => {
    const cloned = JSON.parse(JSON.stringify(collection))
    cloned.title = title
    cloned.desc = desc
    dispatch(collectionService.update(cloned))
  }

  useEffect(() => {
    setTitle(collection.title)
    setDesc(collection.desc)
    dispatch(configService.navItemOpened(collection))
  }, [collection, dispatch])

  return (
    <Box sx={{ p: 2 }}>
      <Box>
        <WorkspaceNavBar _id={collectionId ?? ''} />
        <Box sx={{ pt: 1 }}>
          <Divider />
        </Box>
      </Box>
      <Container>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h3" gutterBottom>
            Collection
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
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
        <Box sx={{ mt: 3 }}>
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
        <Button sx={{ mt: 2 }} variant="contained" size="large" onClick={handleUpdateClick}>
          Update
        </Button>
      </Container>
    </Box>
  )
}
