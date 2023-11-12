import { Button } from '@mui/joy'
import { useAppDispatch } from '../../../app/hook'
import { requestItem } from '../requestItem'
import { sendRequest } from '../service/requestService'
import { Box } from '@mui/material'

type requestDataProps = {
  method: string
  url: string
}
export default function SendRequestButton(props: requestDataProps) {
  const dispatch = useAppDispatch()

  const handleSendRequest = () => {
    // RequestPage에서 값을 가져와서 distpatch(sendRequest())를 호출한다.
    const newItem = new requestItem()
    newItem.method = props.method
    newItem.url = props.url
    dispatch(sendRequest(newItem))
  }

  return (
    <Box>
      <Button onClick={handleSendRequest}>Send</Button>
    </Box>
  )
}
