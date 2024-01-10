import { Avatar, Box, Typography } from '@mui/material'
import WorkspaceList from '../workspaces/components/WorkspaceList'
import NewWorkspace from '../workspaces/components/NewWorkspace'
import { useAppSelector } from '../../app/hook'
import { selectAllWorkspaces } from '../workspaces/service/workspaceSlice'

export default function HomePage() {
  const allWorkspaces = useAppSelector(selectAllWorkspaces)

  return (
    /* HomePage에서는 workspace들을 표시 */
    <Box>
      {/* HomePage의 상단 부분  */}
      <Box
        sx={{
          height: '160px',
          backgroundColor: '#FAFAFB'
        }}
      >
        {/* HomePage의 상단에는 'WorkspaceList'라는 문구와 'WorkspaceList'의 설명이 표시 */}
        <Box sx={{ display: 'flex' }}>
          <Box sx={{ ml: 60, mt: -5 }}>
            <Box sx={{ display: 'flex' }}>
              <Typography
                variant="h4"
                display="block"
                gutterBottom
                sx={{ justifyItems: 'center', mt: 11, fontWeight: 'bold' }}
              >
                Workspace List
              </Typography>
              <Typography
                variant="body1"
                display="block"
                gutterBottom
                sx={{ mt: 18, ml: -29.5, mr: 50 }}
              >
                Please select the workspace you'd like to move to.
              </Typography>
            </Box>
          </Box>

          {/* Icon 표시 */}
          <Box sx={{ mt: -16.5 }}>
            <Avatar
              alt="ToolBal Icon"
              src="/icon.jpg"
              sx={{
                width: '150px',
                height: '150px',
                mr: '-110px',
                mt: '140px',
                borderRadius: '12px'
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* HomePage의 하단 부분 */}
      <Box sx={{ mt: 20, alignItems: 'center', justifyContent: 'center' }}>
        {/* workspace가 있을 경우, workspace 목록 표시 */}
        {allWorkspaces.length !== 0 ? (
          <Box sx={{ width: '100%' }}>
            {/* 새로운 workspace를 생성할 수 있는 버튼 표시 */}
            <Box sx={{ display: 'flex', ml: 150.5, mt: -18 }}>
              <NewWorkspace />
            </Box>

            {/* workspace 목록 표시 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 20, mr: 23 }}>
              <WorkspaceList />
            </Box>
          </Box>
        ) : (
          // workspace가 없을 경우, workspace 생성 버튼 표시
          <Box sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 33 }}>
              <WorkspaceList />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <NewWorkspace />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}
