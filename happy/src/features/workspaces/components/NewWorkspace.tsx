import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useAppDispatch } from '../../../app/hook'
import { workspaceItem } from '../workspaceItem'
import { createWorkspace } from '../workspacesSlice'

export default function NewWorkspace() {
  const [open, setOpen] = React.useState(false)
  const [title, setTitle] = React.useState('')
  const [desc, setDesc] = React.useState('')

  const dispatch = useAppDispatch()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const addWorkspace = () => {
    const newWorkspace: workspaceItem = {
      id: '',
      title: title,
      desc: desc,
      created: Date.now(),
      updated: Date.now(),
      authorId: 'admin',
      collections: []
    }

    dispatch(createWorkspace(newWorkspace))
    setOpen(false)
  }

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        New Workspace
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create Workspace</DialogTitle>
        <DialogContent>
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
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addWorkspace}>Create</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
