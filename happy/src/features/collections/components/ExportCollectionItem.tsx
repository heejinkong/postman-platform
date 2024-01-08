import { MenuItem, Typography } from '@mui/material'
import { selectCollectionById } from '../service/collectionSlice'
import { useAppSelector } from '../../../app/hook'
import { collectionItem } from '../domain/collectionEntity'
import { selectAllFolders } from '../../folders/service/folderSlice'
import { folderItem } from '../../folders/domain/folderEntity'

type exportCollectionItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function ExportCollectionItem(props: exportCollectionItemProps) {
  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))

  const folderInCollection = useAppSelector(selectAllFolders).filter((folder) => {
    return folder.parentId === props.collectionId
  })
  const folders = useAppSelector(selectAllFolders) ?? []

  const handleExport = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    exportCollectionToJson(props.collectionId, collection, folders)

    props.handleClose(e)
  }

  const exportCollectionToJson = (
    collectionId: string,
    collection: collectionItem,
    folders: folderItem[]
  ) => {
    const collectionData = getCollectionData(collection, folders)
    const jsonData = JSON.stringify(collectionData, null, 2)
    const blob = new Blob([jsonData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `collection_${collectionId}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFolderData = (folder: folderItem) => {
    return {
      name: folder.title
      //   item: folder.requests.map((request) => getRequestData(request))
    }
  }

  const getCollectionData = (collection: collectionItem, folders: folderItem[]) => {
    return {
      info: {
        type: 'collection',
        name: collection.title,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: { name: 'folder', item: folderInCollection.map((folder) => getFolderData(folder)) }
    }
  }

  return (
    <MenuItem onClick={(e) => handleExport(e)}>
      <Typography textAlign="center">Export</Typography>
    </MenuItem>
  )
}
