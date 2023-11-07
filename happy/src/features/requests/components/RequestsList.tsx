import { List } from '@mui/material'
import RequestsListItem from './RequestsListItem'

type requestListProps = {
  requests: string[]
}

export default function RequestsList(props: requestListProps) {
  return (
    <List component="div" disablePadding>
      {props.requests.map((id) => (
        <RequestsListItem key={id} requestId={id} />
      ))}
    </List>
  )
}
