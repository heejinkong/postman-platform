import { Box, Button, Container, Divider, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { useParams } from 'react-router-dom'
import { selectFolderById } from './service/folderSlice'
import { folderItem } from './domain/folderEntity'
import folderService from './service/folderService'
import configService from '../config/service/configService'
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'

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

  return (
    /* FolderPage에서는 해당 folder의 title과 description을 수정하는 페이지 */
    <Box sx={{ p: 2 }}>
      {/* FolderPage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <Box>
        <WorkspaceNavBar _id={folderId ?? ''} />
        <Box sx={{ pt: 1 }}>
          <Divider />
        </Box>
      </Box>
      <Container>
        {/* FolderPage의 title */}
        <Box sx={{ mt: 5 }}>
          <Typography variant="h3" gutterBottom>
            Folder
          </Typography>
        </Box>

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

        {/* FolderPage의 수정 버튼 */}
        <Button sx={{ mt: 2 }} variant="contained" size="large" onClick={handleUpdateClick}>
          Update
        </Button>
      </Container>
    </Box>
  )
}
