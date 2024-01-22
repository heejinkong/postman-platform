import { Box, Button, Container, Divider, TextField } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { selectWorkspaceById } from './service/workspaceSlice'
import { workspaceItem } from './domain/workspaceItem'
import workspaceService from './service/workspaceService'
import WorkspaceNavBar from './components/WorkspaceNavBar'
import configService from '../config/service/configService'
import { styled } from '@mui/system'
import SaveIcon from '@mui/icons-material/Save'
import SlideshowIcon from '@mui/icons-material/Slideshow'

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

  const NavBarBox = styled(Box)({
    '&.NavBarBox': {
      padding: '12px 16px 0 16px',
      '& a': {
        fontSize: '14px'
      },
      '& > .NavBarBoxDivider': {
        marginTop: '12px'
      }
    }
  })

  const StyledContainer = styled(Container)({
    '&.StyledContainer': {
      padding: '0 16px',
      maxWidth: '100%'
    }
  })

  return (
    //WorkspacePage
    <Box>
      {/* WorkspacePage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <NavBarBox className="NavBarBox">
        <WorkspaceNavBar _id={workspaceId ?? ''} />
        <Box className="NavBarBoxDivider">
          <Divider />
        </Box>
      </NavBarBox>
      <StyledContainer className="StyledContainer">
        {/* WorkspacePage의 수정 버튼 */}
        <Box sx={{ padding: '12px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            className="btnWhite"
            variant="contained"
            size="small"
            onClick={updateWs}
            sx={{ marginRight: '12px' }}
            startIcon={<SlideshowIcon />}
          >
            Run Collection
          </Button>
          <Button
            className="btnWhite"
            variant="contained"
            size="small"
            startIcon={<SaveIcon />}
            onClick={updateWs}
          >
            Save
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '54px' }}>
          <Box
            sx={{
              maxWidth: '868px',
              width: '100%'
            }}
          >
            {/* WorkspacePage의 title */}
            {/* <Box>
              <Typography variant="h3" gutterBottom>
                Workspace
              </Typography>
            </Box> */}
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
            <Box
              sx={{
                mt: 3,
                '& .MuiInputBase-root': {
                  padding: 0
                }
              }}
            >
              <TextField
                fullWidth
                id="desc"
                label="Description"
                multiline
                rows={15}
                sx={{
                  mb: '16px',
                  '& .MuiInputBase-input': {
                    padding: '16px 14px'
                  }
                }}
                onChange={(e) => {
                  setDesc(e.target.value)
                }}
                value={desc}
              />
            </Box>
          </Box>
        </Box>
      </StyledContainer>
    </Box>
  )
}
