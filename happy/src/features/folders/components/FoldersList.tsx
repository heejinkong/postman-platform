import { List } from '@mui/material'
import FoldersListItem from './FoldersListItem'

type folderListProps = {
  folders: string[]
}

export default function FoldersList(props: folderListProps) {
  return (
    <List component="div" disablePadding>
      {props.folders.map((id) => (
        <FoldersListItem key={id} folderId={id} />
      ))}
    </List>
  )
}
