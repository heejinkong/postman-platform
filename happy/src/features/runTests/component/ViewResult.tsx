import React from 'react'
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'

type viewResultProps = {
  response: string
  expected: string
}

export default function ViewResult(props: viewResultProps) {
  const [open, setOpen] = React.useState(false)

  const response = JSON.stringify(props.response, null, 2)
  const expected = JSON.stringify(props.expected, null, 2)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return <div></div>
}
