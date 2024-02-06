import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import React from 'react'

export default function UnsavedRequestDialog() {
  const [open, setOpen] = React.useState(false)

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Box sx={{ pt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex' }}>
            <Dialog open={open} onClose={handleClose}>
              {/* Dialog의 문구*/}

              <DialogContent>
                <Typography variant="h6" gutterBottom>
                  삭제하시겠습니까 ?
                </Typography>
              </DialogContent>

              {/* Dialog의 버튼 */}
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={handleClose}>Delete</Button>
              </DialogActions>
            </Dialog>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
