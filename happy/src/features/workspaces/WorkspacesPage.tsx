import { Box, Button, TextField, Typography } from '@mui/material'
import { useAppSelector } from '../../app/hook'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { updateWorkspace, selectWorkspaceById } from './workspacesSlice'
import { workspaceItem } from './workspaceItem'

export default function WorkspacesPage() {
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  const dispatch = useDispatch()
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const updateWs = () => {
    const cloned: workspaceItem = JSON.parse(JSON.stringify(workspace))
    cloned.title = title
    cloned.desc = desc
    cloned.updated = Date.now()
    dispatch(updateWorkspace(cloned))
  }

  useEffect(() => {
    if (!workspace) {
      navigate('/404')
      return
    }
    setTitle(workspace.title)
    setDesc(workspace.desc)
  }, [navigate, workspace])

  return (
    <Box>
      <Box>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="h3" gutterBottom>
            Workspace
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            required
            fullWidth
            id="title"
            label="Title"
            onChange={(e) => {
              setTitle(e.target.value)
            }}
            value={title}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            id="desc"
            label="Description"
            multiline
            rows={4}
            onChange={(e) => {
              setDesc(e.target.value)
            }}
            value={desc}
          />
        </Box>
        <Button variant="contained" size="large" onClick={updateWs}>
          Update
        </Button>
      </Box>
    </Box>
  )
}
