import { Box, Button, Container, Divider, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { useParams } from 'react-router-dom'
import { selectFolderById } from './service/folderSlice'
import { folderItem } from './domain/folderItem'
import folderService from './service/folderService'
import configService from '../config/service/configService'
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'
import { styled } from '@mui/system'
import SaveIcon from '@mui/icons-material/Save'

export default function FolderPage() {
  const { folderId } = useParams()

  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')

  const dispatch = useAppDispatch()
  const folder = useAppSelector((state) => selectFolderById(state, folderId ?? ''))

  useEffect(() => {
    if (!folder) {
      return
    }
    setTitle(folder.title)
    setDesc(folder.desc)
    dispatch(configService.navItemOpened(folder))
  }, [dispatch, folder])

  const handleUpdateClick = () => {
    const cloned: folderItem = JSON.parse(JSON.stringify(folder))
    cloned.title = title
    cloned.desc = desc
    cloned.updated = Date.now()
    dispatch(folderService.update(cloned))
  }
  const NavBarBox = styled(Box)({
    '&.NavBarBox': {
      padding: '12px 16px 0 16px',
      '& nav': {
        height: '22px'
      },
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
    /* FolderPage에서는 해당 folder의 title과 description을 수정하는 페이지 */
    <Box>
      {/* FolderPage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <NavBarBox className="NavBarBox">
        <WorkspaceNavBar _id={folderId ?? ''} />
        <Box className="NavBarBoxDivider">
          <Divider />
        </Box>
      </NavBarBox>
      <StyledContainer className="StyledContainer">
        {/* FolderPage의 수정 버튼 */}
        <Box sx={{ padding: '12px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            className="btnWhite"
            variant="contained"
            size="small"
            onClick={handleUpdateClick}
            sx={{ marginRight: '12px' }}
            startIcon={<SaveIcon />}
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
            {/* FolderPage의 title을 수정할 수 있는 TextField */}
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

            {/* FolderPage의 description을 수정할 수 있는 TextField */}
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
          </Box>
        </Box>
      </StyledContainer>
    </Box>
  )
}
