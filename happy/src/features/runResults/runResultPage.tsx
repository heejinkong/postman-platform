import { Box, Container, Divider, Typography } from '@mui/material'
import RunTestPage from '../runTests/RunTestPage'
import { useParams } from 'react-router-dom'
import { useAppSelector } from '../../app/hook'
import { selectRunResultById } from './service/runResultSlice'
import { styled } from '@mui/system'

export default function RunResultPage() {
  const { runResultId } = useParams()

  const runResult = useAppSelector((state) => selectRunResultById(state, runResultId ?? ''))

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
    // run을 실행한 결과를 상세히 보여주는 페이지
    <Box>
      {/*RunResultPage의 상단 영역*/}
      <NavBarBox className="NavBarBox">
        Run Result
        <Box className="NavBarBoxDivider">
          <Divider />
        </Box>
      </NavBarBox>
      <StyledContainer className="StyledContainer">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '54px' }}>
          <Box
            sx={{
              maxWidth: '868px',
              width: '100%'
            }}
          >
            {/*RunResultPage의 문구*/}
            <Box sx={{ pb: '60px' }}>
              <Typography variant="h4" sx={{ pb: '12px', fontSize: '24px', fontWeight: 700 }}>
                Run Results
              </Typography>
              <Typography variant="subtitle1" color="rgba(rgba(0, 0, 0, 0.6)">
                Please click on one item to check its run details.
              </Typography>
            </Box>
            {/* <Divider sx={{ my: 7 }} /> */}
            <Box>
              {/*// runResultId에 해당하는 runResult를 가져와서 RunTestPage 컴포넌트에 전달*/}
              <RunTestPage parent={runResult} />
            </Box>
          </Box>
        </Box>
      </StyledContainer>
    </Box>
  )
}
