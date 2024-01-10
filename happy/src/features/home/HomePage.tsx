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
          height: 160,
          p: 1,
          backgroundColor: '#FAFAFB'
        }}
      >
        <Container
          sx={{
            height: '100%',
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
              gutterBottom
              sx={{ justifyItems: 'center', fontWeight: 700 }}
            >
              Workspace List
            </Typography>
            <Typography variant="body1" display="block" gutterBottom sx={{}}>
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
      <Container sx={{ flexGrow: 1 }}>
        {/* workspace 목록 표시 */}
        <WorkspaceList />
      </Container>
    </Box>
  )
}
