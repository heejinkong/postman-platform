import { Box, Button, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { createCollection } from '../collectionsSlice'
import { selectWorkspaceById, updateWorkspace } from '../../workspaces/workspacesSlice'
import { collectionItem } from '../collectionItem'

export default function NewCollectionPage() {
  const { workspaceId, collectionId } = useParams()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))

  useEffect(() => {
    if (collectionId === `new`) {
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

    navigate(`/workspaces/${workspaceId}/collections/${newCollection.id}`)
  }

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

        <Button variant="contained" size="large" onClick={handleSaveClick}>
          Save
        </Button>
      </Box>
    </Box>
  )
}
