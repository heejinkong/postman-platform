import * as React from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { useAppDispatch } from '../../../app/hook'
import { workspaceItem } from '../domain/workspaceItem'
import workspaceService from '../service/workspaceService'
import { useNavigate } from 'react-router-dom'
import { Box } from '@mui/material'
// import '../../../App.css'
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
    <Box
      sx={{
        padding: 0
      }}
    >
      {/* NewWorkspace 버튼 클릭 시, 새로운 workspace 생성 */}
      <Button className="btnBlue" variant="contained" onClick={handleClickOpen}>
        New Workspace
      </Button>
      {/* NewWorkspace 버튼 클릭 시, Dialog 렌더링 */}
      <Dialog open={open} onClose={handleClose}>
        <Box sx={{ width: '100%' }}>
          {/* Dialog의 문구*/}
          <DialogTitle
            sx={{
              fontSize: '20px',
              fontStyle: 'normal',
              fontWeight: '500',
              lineHeight: '160%',
              letterSpacing: '0.15px',
              maxWidth: '600px',
              width: '100%'
            }}
          >
            New Workspace
          </DialogTitle>
          <DialogContent sx={{ padding: '24px', pt: '24px !important', width: '100%' }}>
            {/* Dialog의 title을 입력할 수 있는 TextField */}
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Workspace Name *"
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                margin: 0,
                height: '56px',
                '& .MuiFormLabel-root': {
                  fontSize: '16px'
                },
                '& .MuiInputBase-input': {
                  fontSize: '16px'
                },
                '& .MuiFormLabel-root.Mui-focused': {
                  color: '#1877F2 !important'
                },
                '& .MuiInputBase-root.MuiInput-root': {
                  '&:after': {
                    borderBottom: '2px solid #1877F2 !important'
                  }
                }
              }}
              InputProps={{
                sx: {
                  height: '100%'
                }
              }}
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
              variant="standard"
              onChange={(e) => setDesc(e.target.value)}
              sx={{
                m: 0,
                mt: '16px',
                maxHeight: '128px',
                height: '100%;',
                minHeight: '56px',
                '& textarea': {
                  overflowY: 'auto !important'
                },
                '& .MuiInputBase-root': {
                  mt: '16px'
                },
                '& .MuiInput-input': {
                  maxHeight: '75px',
                  paddingBottom: '5px'
                }
              }}
              InputProps={{
                sx: {
                  height: '100%',
                  minHeight: '40px',
                  padding: 0,
                  '& input::-webkit-scrollbar-thumb': {
                    backgroundColor: 'pink !important'
                  }
                }
              }}
            />
          </DialogContent>

          {/* Dialog의 버튼 */}
          <DialogActions sx={{ padding: '16px 24px', width: '100%' }}>
            <Button sx={{ padding: '8px 22px', fontSize: '15px !important' }} onClick={handleClose}>
              Cancel
            </Button>
            <Button
              sx={{ padding: '8px 22px', fontSize: '15px !important' }}
              className="btnBlue"
              onClick={addWorkspace}
            >
              Create
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  )
}
