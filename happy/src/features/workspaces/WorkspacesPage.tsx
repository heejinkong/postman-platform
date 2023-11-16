import { Box, Button, Container, TextField, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { selectWorkspaceById } from './workspacesSlice'
import { workspaceItem } from './workspaceItem'
import workspaceService from './service/workspaceService'
import WorkspaceNavBar from './components/WorkspaceNavBar'

export default function WorkspacesPage() {
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  const dispatch = useAppDispatch()
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const updateWs = () => {
    const cloned: workspaceItem = JSON.parse(JSON.stringify(workspace))
    cloned.title = title
    cloned.desc = desc
    dispatch(workspaceService.update(cloned))
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
      <Box sx={{ p: 2 }}>
        <WorkspaceNavBar />
      </Box>
      <Container>
        <Box sx={{ mt: 5 }}>
          <Typography variant="h3" gutterBottom>
            Workspace
          </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
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
        <Box sx={{ mt: 3 }}>
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
        <Button sx={{ mt: 2 }} variant="contained" size="large" onClick={updateWs}>
          Update
        </Button>
      </Container>
    </Box>
  )
}
