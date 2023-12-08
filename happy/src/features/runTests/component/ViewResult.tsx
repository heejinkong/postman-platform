import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import CodeMirrorMerge from 'react-codemirror-merge'
import CodeMirror from '@uiw/react-codemirror'
import { json } from '@codemirror/lang-json'

type viewResultProps = {
  title: string
  response: string
  expected: string
}

export default function ViewResult(props: viewResultProps) {
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  console.log(props.expected)
  return (
    <Box>
      <Button variant="outlined" sx={{ size: 'large' }} onClick={handleClickOpen}>
        View Result
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
        <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>
        <DialogContent>
          {props.expected !== '' ? (
            <Box sx={{ height: '100%', overflow: 'auto' }}>
              <CodeMirrorMerge>
                <CodeMirrorMerge.Original value={props.expected} extensions={[json()]} />
                <CodeMirrorMerge.Modified value={props.response} extensions={[json()]} />
              </CodeMirrorMerge>
            </Box>
          ) : (
            <Box sx={{ height: '100%', overflow: 'auto' }}>
              <CodeMirror extensions={[json()]} value={props.response} editable={false} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
