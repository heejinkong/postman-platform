import { Button } from '@mui/joy'
import { useAppDispatch } from '../../../app/hook'
import { requestItem } from '../requestItem'
import { sendRequest } from '../service/requestService'
import { Box } from '@mui/material'

export default function SendRequestButton() {
  const dispatch = useAppDispatch()

  const handleSendRequest = () => {
    const newItem = new requestItem()
    dispatch(sendRequest(newItem))
  }

  return (
    <Box>
      <Button onClick={handleSendRequest}>Send</Button>
    </Box>
  )
}
