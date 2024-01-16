import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Typography
} from '@mui/material'
import BuildIcon from '@mui/icons-material/Build'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { environmentItem } from '../../variables/domain/environmentItem'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import environmentService from '../../variables/service/environmentService'
import { selectAllEnvironments } from '../../variables/service/environmentSlice'
import { selectRequestById } from '../service/requestSlice'
import { globalsItem } from '../../globalsVariable/domain/globalsItem'
import globalsService from '../../globalsVariable/service/globalsService'
import { selectWorkspaceById } from '../../workspaces/service/workspaceSlice'

type SettingsVariableProps = {
  _id: string
}
export default function SettingsVariable(props: SettingsVariableProps) {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const { workspaceId } = useParams()
  const { requestId } = useParams()

  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''))
  const workspaceGlobalId = workspace?.globalsId

  const request = useAppSelector((state) => selectRequestById(state, requestId ?? ''))
  const requestEnvironmentId = request.environmentId

  const dispatch = useAppDispatch()

  const environments = useAppSelector(selectAllEnvironments)
  const environment = environments.find((item) => item.parentId === props._id)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleAddEnvironment = () => {
    const newItem = new environmentItem()
    newItem.title = 'New Environment'
    newItem.workspaceId = workspaceId ?? ''
    newItem.parentId = props._id
    dispatch(environmentService.new(newItem))

    navigate(`/workspaces/${workspaceId}/environments/${newItem.id}`)
  }

  const handleEditEnvironment = () => {
    navigate(`/workspaces/${workspaceId}/environments/${requestEnvironmentId}`)
  }

  const handleAddGlobals = () => {
    const newItem = new globalsItem()
    newItem.title = 'Globals'
    newItem.workspaceId = workspaceId ?? ''

    dispatch(globalsService.new(newItem))

    navigate(`/workspaces/${workspaceId}/globals`)
  }

  return (
    <Box>
      {/* BuildIcon 버튼 클릭 시, Dialog 노출 */}
      <IconButton sx={{ pr: 5 }} size="small" aria-label="settings" onClick={handleClickOpen}>
        <BuildIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
        <Box sx={{ width: 600, height: 250 }}>
          {requestEnvironmentId.length > 0 ? (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 2
                }}
              >
                <DialogTitle>
                  <Typography variant="h6" gutterBottom>
                    {environment?.title}
                  </Typography>
                </DialogTitle>
                <Button variant="text" onClick={handleEditEnvironment}>
                  Edit
                </Button>
              </Box>
              <DialogContent></DialogContent>
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 2
                }}
              >
                <DialogTitle>
                  <Typography variant="h6" gutterBottom>
                    Environment
                  </Typography>
                </DialogTitle>
                <Button variant="text" onClick={handleAddEnvironment}>
                  Add
                </Button>
              </Box>
              <DialogContent>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 5, ml: 3 }}>
                    No Environment variables
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom sx={{ mt: 1, ml: 2 }}>
                    An environment is a set of variables that allow you to switch the context of
                    your requests.
                  </Typography>
                </Box>
              </DialogContent>
            </Box>
          )}
        </Box>

        <Divider />
        <Box sx={{ width: 600, height: 250 }}>
          {workspaceGlobalId.length > 0 ? (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 2
                }}
              >
                <DialogTitle>
                  <Typography variant="h6" gutterBottom>
                    Globals
                  </Typography>
                </DialogTitle>
                <Button variant="text" onClick={handleEditEnvironment}>
                  Edit
                </Button>
              </Box>
              <DialogContent>hi</DialogContent>
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pr: 2
                }}
              >
                <DialogTitle>
                  <Typography variant="h6" gutterBottom>
                    Globals
                  </Typography>
                </DialogTitle>
                <Button variant="text" onClick={handleAddGlobals}>
                  Add
                </Button>
              </Box>
              <DialogContent>
                <Box>
                  <Typography variant="subtitle2" gutterBottom sx={{ mt: 5, ml: 3 }}>
                    No global variables
                  </Typography>
                  <Typography variant="caption" display="block" gutterBottom sx={{ mt: 1, ml: 2 }}>
                    Global variables are a set of variables that are always available in a
                    workspace.
                  </Typography>
                </Box>
              </DialogContent>
            </Box>
          )}
        </Box>
      </Dialog>
    </Box>
  )
}
