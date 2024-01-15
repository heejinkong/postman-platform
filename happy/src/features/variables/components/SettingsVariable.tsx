import { Box, Button, Dialog, DialogTitle, Divider, IconButton } from '@mui/material'
import BuildIcon from '@mui/icons-material/Build'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { environmentItem } from '../domain/environmentEntity'
import { useAppDispatch } from '../../../app/hook'
import environmentService from '../service/environmentService'

export default function SettingsVariable() {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  const dispatch = useAppDispatch()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const addEnvironment = () => {
    const newItem = new environmentItem()
    newItem.title = 'New Environment'
    dispatch(environmentService.new(newItem))

    navigate(`/workspaces/${workspaceId}/environments/${newItem.id}`)
  }
  return (
    <Box>
      {/* BuildIcon 버튼 클릭 시, Dialog 노출 */}
      <IconButton sx={{ pr: 5 }} size="small" aria-label="settings" onClick={handleClickOpen}>
        <BuildIcon />
      </IconButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
        <Box sx={{ width: 600, height: 250 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}
          >
            <DialogTitle>Environment</DialogTitle>
            <Button variant="text" onClick={addEnvironment}>
              Add
            </Button>
          </Box>
        </Box>

        <Divider />
        <Box sx={{ width: 600, height: 250 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pr: 2 }}
          >
            <DialogTitle>Globals</DialogTitle>
            <Button variant="text">Add</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}
