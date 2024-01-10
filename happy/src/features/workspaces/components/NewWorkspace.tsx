import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useAppDispatch } from '../../../app/hook'
import { workspaceItem } from '../domain/workspaceEntity'
import workspaceService from '../service/workspaceService'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'

export default function NewWorkspace() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [desc, setDesc] = React.useState('')

  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const addWorkspace = () => {
    const newItem = new workspaceItem()
    newItem.title = title
    newItem.desc = desc
    dispatch(workspaceService.new(newItem))

    navigate(`/workspaces/${newItem.id}`)
    setOpen(false)
  }

  return (
    <Box>
      {/* NewWorkspace 버튼 클릭 시, 새로운 workspace 생성 */}
      <Button variant="contained" size="large" onClick={handleClickOpen}>
        New Workspace
      </Button>
      {/* NewWorkspace 버튼 클릭 시, Dialog 렌더링 */}
      <Dialog open={open} onClose={handleClose}>
        {/* Dialog의 문구*/}
        <DialogTitle>Create Workspace</DialogTitle>
        <DialogContent>
          {/* Dialog의 title을 입력할 수 있는 TextField */}
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
          />
          {/* Dialog의 description을 입력할 수 있는 TextField */}
          <TextField
            autoFocus
            margin="dense"
            id="desc"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="standard"
            onChange={(e) => setDesc(e.target.value)}
          />
        </DialogContent>

        {/* Dialog의 버튼 */}
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addWorkspace}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
