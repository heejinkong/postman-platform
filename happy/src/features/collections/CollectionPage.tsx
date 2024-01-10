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
    /* CollectionPage에서는 해당 collection의 title과 description을 수정하는 페이지 */
    <Box sx={{ p: 2 }}>
      {/* CollectionPage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <Box>
        <WorkspaceNavBar _id={collectionId ?? ''} />
        <Box sx={{ pt: 1 }}>
          <Divider />
        </Box>
      </Box>
      <Container>
        {/* CollectionPage의 title */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h3" gutterBottom>
            Collection
          </Typography>
        </Box>

        {/* CollectionPage의 title을 수정할 수 있는 TextField */}
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

        {/* CollectionPage의 description을 수정할 수 있는 TextField */}
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

        {/* 수정한 title과 description을 update하는 버튼 */}
        <Button sx={{ mt: 2 }} variant="contained" size="large" onClick={handleUpdateClick}>
          Update
        </Button>
      </Container>
    </Box>
  )
}
