import { Box, Container, Typography } from '@mui/material'
import WorkspaceList from '../workspaces/components/WorkspaceList'

export default function HomePage() {
  return (
    /* HomePage에서는 workspace들을 표시 */
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {' '}
      {/* HomePage의 상단 부분  */}
      <Box
        sx={{
          height: '164px',
          backgroundColor: '#FAFAFB',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container
          sx={{
            width:'868px',
            height: '108px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {' '}
          {/* HomePage의 상단에는 'WorkspaceList'라는 문구와 'WorkspaceList'의 설명이 표시 */}
          <Box>
            <Typography
              variant="h5"
              display="block"
              sx={{ 
                fontSize: '24px',
                fontWeight: 700 ,
                marginBottom:'12px'
              }}
            >
              Workspace List
            </Typography>
            <Typography variant="body1" display="block" sx={{}}>
              Please select the workspace you'd like to move to.
            </Typography>
          </Box>
          {/* Icon 표시 */}
          <Box
            component="img"
            src="/icon.jpg"
            sx={{
              width: 108,
              height: 108
            }}
          ></Box>
        </Container>
      </Box>
      {/* HomePage의 하단 부분 */}
      <Container sx={{
        display: "flex", justifyContent: 'center', height: 'calc(100% - 164px)'
      }}>
        {/* workspace 목록 표시 */}
        <WorkspaceList />
      </Container>
    </Box>
  )
}
