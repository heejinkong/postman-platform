import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import * as Diff from 'diff'
import * as Diff2Html from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

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
  const diff = Diff.createTwoFilesPatch(
    'ExpectedData',
    'ResposneData',
    `${expected}`,
    `${response}`
  )

  let outputHtml = ''
  if (Diff2Html.html) {
    const diff2htmlConfig: Diff2Html.Diff2HtmlConfig = {
      matching: 'lines',
      drawFileList: false,
      outputFormat: 'side-by-side'
    }

    outputHtml = Diff2Html.html(diff, diff2htmlConfig)
    //console.log(outputHtml)
  }

  return (
    <div>
      <Button variant="outlined" sx={{ size: 'large' }} onClick={handleClickOpen}>
        View Result
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>View Result</DialogTitle>
        <DialogContent>
          <div dangerouslySetInnerHTML={{ __html: outputHtml }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          {/* <Button onClick={addWorkspace}>Create</Button> */}
        </DialogActions>
      </Dialog>
    </div>
  )
}
