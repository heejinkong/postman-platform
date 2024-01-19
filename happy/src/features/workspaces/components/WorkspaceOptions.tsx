import { Box, Button, Divider, Menu, MenuItem, MenuProps, alpha, styled } from '@mui/material'
import React from 'react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import NewWorkspace from './NewWorkspace'
import { useNavigate, useParams } from 'react-router-dom'
import RunWorkspaceOptionItem from './RunWorkspaceOptionItem'
import { selectWorkspaceById } from '../service/workspaceSlice'
import { useAppSelector } from '../../../app/hook'
import SettingsVariable from '../../globalsVariable/components/SettingsVariable'
import ImportCollectionItem from '../../collections/components/ImportCollectionItem'

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right'
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right'
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color: theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0'
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5)
      },
      '&:active': {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity)
      }
    }
  }
}))

export default function WorkspaceOptions() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const { workspaceId } = useParams()
  const workspaceID = workspaceId as string
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceID))

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleHistoryClick = () => {
    navigate(`/workspaces/${workspaceId}/runHistory`)
    handleClose()
  }

  return (
    /* Workspace Options 버튼 클릭 시, Workspace Options 메뉴가 나타나도록 설정 */
    <Box>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        endIcon={<KeyboardArrowRightIcon />}
        sx={{ ml: 3.5, width: 240, height: 40, justifyContent: 'center' }}
      >
        Workspace Options
      </Button>

      {/* Workspace Options 메뉴 */}
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button'
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{ mt: -5, ml: 23 }}
      >
        {/* Workspace Options 메뉴의 Run History 클릭 시, 해당 workspace의 run history로 이동 */}
        <MenuItem onClick={handleHistoryClick} disableRipple sx={{ justifyContent: 'center' }}>
          Run History
        </MenuItem>
        {/* Workspace Options 메뉴의 Run Workspace 클릭 시, 해당 workspace의 run workspace로 이동 */}
        <MenuItem onClick={handleClose} disableRipple sx={{ justifyContent: 'center' }}>
          <RunWorkspaceOptionItem workspaceId={workspace.id} />
        </MenuItem>

        <Box>
          <Divider sx={{ my: 0.5 }} />
        </Box>
        {/* Workspace Options 메뉴의 Environment 클릭 시, Dialog 창 노출 */}

        <SettingsVariable />

        {/* Workspace Options 메뉴의 Import Collection 클릭 시, 해당 workspace의 collection import */}
        <ImportCollectionItem />
        {/* Workspace Options 메뉴의 Export Collection 클릭 시, 해당 workspace의 collection export */}
        <MenuItem onClick={handleClose} disableRipple sx={{ justifyContent: 'center' }}>
          Export Collection
        </MenuItem>

        {/* 새로운 Workspace 생성 버튼 */}
        <Box sx={{ p: 1, ml: 2 }}>
          <NewWorkspace />
        </Box>
      </StyledMenu>
    </Box>
  )
}
