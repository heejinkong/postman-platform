import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import CodeMirrorMerge from 'react-codemirror-merge';
import CodeMirror from '@uiw/react-codemirror';
import { json } from '@codemirror/lang-json';

type viewResultProps = {
  title: string;
  response: string;
  expected: string;
};

export default function ViewResult(props: viewResultProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    // ViewResult 컴포넌트는 Dialog를 사용하여 결과를 표시
    <Box>
      {/* ViewResult 버튼을 클릭하면 Dialog 창 열림 */}
      <Button variant='outlined' sx={{ size: 'large' }} onClick={handleClickOpen}>
        View Result
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title'>
        <Box sx={{ width: 600, height: 500 }}>
          {/* Dialog 창 상단에는 title 표시 */}
          <DialogTitle sx={{ pt: 1, pb: 1 }} id='alert-dialog-title'>
            {props.title}
          </DialogTitle>
          <Box sx={{ height: '90%', width: '100%' }}>
            {/* Dialog 창 중앙에는 응답값 표시 */}
            <Box sx={{ height: '85%' }}>
              <DialogContent>
                {props.expected !== '' ? (
                  // expected 값이 있으면 CodeMirrorMerge를 사용하여 응답값과 expected값을 비교하여 표시
                  <Box sx={{ height: '100%', overflow: 'auto' }}>
                    <CodeMirrorMerge>
                      <CodeMirrorMerge.Original value={props.expected} extensions={[json()]} />
                      <CodeMirrorMerge.Modified value={props.response} extensions={[json()]} />
                    </CodeMirrorMerge>
                  </Box>
                ) : (
                  // expected 값이 없으면 응답값만 표시
                  <Box sx={{ height: '100%', overflow: 'auto' }}>
                    <CodeMirror extensions={[json()]} value={props.response} editable={false} />
                  </Box>
                )}
              </DialogContent>
            </Box>
            {/* Dialog 창 하단에는 close 버튼 표시 */}
            <DialogActions sx={{ pb: 1 }}>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
