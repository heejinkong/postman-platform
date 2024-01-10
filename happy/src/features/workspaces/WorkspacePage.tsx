import { Box, Button, Container, Divider, TextField, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { selectWorkspaceById } from './service/workspaceSlice'
import { workspaceItem } from './domain/workspaceEntity'
import workspaceService from './service/workspaceService'
import WorkspaceNavBar from './components/WorkspaceNavBar'
import configService from '../config/service/configService'

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
    dispatch(configService.navItemOpened(workspace))
  }, [dispatch, navigate, workspace])

  return (
    //WorkspacePage
    <Box sx={{ p: 2 }}>
      {/* WorkspacePage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <Box>
        <WorkspaceNavBar _id={workspaceId ?? ''} />
        <Box sx={{ pt: 1 }}>
          <Divider />
        </Box>
      </Box>
      <Container>
        <Box sx={{ mt: 5 }}>
          {/* WorkspacePage의 title */}
          <Typography variant="h3" gutterBottom>
            Workspace
          </Typography>
        </Box>

        {/* WorkspacePage의 title을 수정할 수 있는 TextField */}
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

        {/* WorkspacePage의 description을 수정할 수 있는 TextField */}
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

        {/* WorkspacePage의 수정 버튼 */}
        <Button sx={{ mt: 2 }} variant="contained" size="large" onClick={updateWs}>
          Update
        </Button>
      </Container>
    </Box>
  )
}
