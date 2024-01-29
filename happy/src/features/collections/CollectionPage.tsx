import { Box, Button, Container, Divider, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hook'
import { selectCollectionById } from './service/collectionSlice'
import { useNavigate, useParams } from 'react-router-dom'
import collectionService from './service/collectionService'
import configService from '../config/service/configService'
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar'
import { styled } from '@mui/system'
import SaveIcon from '@mui/icons-material/Save'
import SlideshowIcon from '@mui/icons-material/Slideshow'

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
    /* CollectionPage에서는 해당 collection의 title과 description을 수정하는 페이지 */
    <Box>
      {/* CollectionPage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <NavBarBox className="NavBarBox">
        <WorkspaceNavBar _id={collectionId ?? ''} />
        <Box className="NavBarBoxDivider">
          <Divider />
        </Box>
      </NavBarBox>
      <StyledContainer className="StyledContainer">
        {/* 수정한 title과 description을 update하는 버튼 */}
        <Box sx={{ padding: '12px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            className="btnWhite"
            variant="contained"
            size="small"
            onClick={handleUpdateClick}
            sx={{ marginRight: '12px' }}
            startIcon={<SlideshowIcon />}
          >
            Run Collection
          </Button>
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
            {/* CollectionPage의 title을 수정할 수 있는 TextField */}
            <Box sx={{ mt: 3 }}>
              <TextField
                required
                fullWidth
                id="outlined-required"
                label="Collection Name111"
                onChange={(e) => {
                  setTitle(e.target.value)
                }}
                value={title}
              />
            </Box>
            {/* CollectionPage의 description을 수정할 수 있는 TextField */}
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
                id="outlined-multiline-static"
                label="Description"
                multiline
                rows={15}
                value={desc}
                sx={{
                  mb: '16px',
                  '& .MuiInputBase-input': {
                    padding: '16px 14px'
                  }
                }}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Box>
          </Box>
        </Box>
      </StyledContainer>
    </Box>
  )
}
