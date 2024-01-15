import { MenuItem, Typography } from '@mui/material'
import { selectCollectionById } from '../service/collectionSlice'
import { useAppSelector } from '../../../app/hook'
import { collectionItem } from '../domain/collectionItem'
import { selectAllFolders } from '../../folders/service/folderSlice'
import { folderItem } from '../../folders/domain/folderItem'
import { requestItem } from '../../requests/domain/requestItem'
import { selectAllRequests } from '../../requests/service/requestSlice'

type exportCollectionItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function ExportCollectionItem(props: exportCollectionItemProps) {
  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))
  const folders = useAppSelector(selectAllFolders) ?? []
  const requests = useAppSelector(selectAllRequests) ?? []

  const requestList: requestItem[] = []
  const subFolderList: folderItem[] = []

  const folderInCollection = folders.filter((folder) => {
    return folder.parentId === props.collectionId
  })

  const requestInCollection = requests.filter((request) => {
    return request.parentId === props.collectionId
  })

  const dfs = (folderId: string) => {
    const requestInFolder = requests.filter((request) => request.parentId === folderId)
    requestList.push(...requestInFolder)

    const subFolder = folders.filter((folder) => folder.parentId === folderId)
    if (subFolder.length > 0) {
      subFolder.forEach((folder) => {
        dfs(folder.id)
        subFolderList.push(folder)
      })
    }

    return { requestList, subFolderList }
  }

  const handleExport = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    exportCollectionToJson(props.collectionId, collection)

    props.handleClose(e)
  }

  const exportCollectionToJson = (collectionId: string, collection: collectionItem) => {
    const collectionData = getCollectionData(collection)
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

  const getSubFolderData = (folder: folderItem) => {
    const subFolder = subFolderList.filter((subFolder) => subFolder.parentId === folder.id)

    if (subFolder.length > 0) {
      return subFolder.map((subFolder) => ({
        name: subFolder.title,
        item: getSubFolderData(subFolder).item
      }))
    } else {
      return {
        name: folder.title,
        item: requestList
          .filter((request) => request.parentId === folder.id)
          .map((request) => getRequestData(request))
      }
    }
  }

  const getFolderData = (folder: folderItem) => {
    dfs(folder.id)

    return {
      name: folder.title,
      item: [
        ...requestList
          .filter((request) => request.parentId === folder.id)
          .map((request) => getRequestData(request)),
        ...subFolderList
          .filter((subFolder) => subFolder.parentId === folder.id)
          .map((subFolder) => getSubFolderData(subFolder))
      ]
    }
  }

  const getRequestData = (request: requestItem) => {
    const requestData = {
      method: request.method,
      header: [
        {
          key: 'Content-Type',
          value: 'application/json'
        }
      ],
      body: {},
      url: {
        raw: request.url,
        // protocol: parsedUrl.protocol.split(':')[0] ?? '',
        // host: parsedUrl.hostname.split('.') ?? [],
        // port: parsedUrl.port ?? '',
        // path: parsedUrl.pathname.split('/').filter((path) => path !== '') ?? []
        query: request.params.map((params) => ({
          key: params._key,
          value: params._value
        }))
      },
      response: []
    }
    if (request.body.mode === 'raw') {
      requestData.body = {
        mode: 'raw',
        raw: { data: request.body.rawData },
        options: {
          raw: {
            language: request.body.rawType
          }
        }
      }
    } else if (request.body.mode === 'formdata') {
      requestData.body = {
        mode: 'formdata',
        formdata: request.body.formData.map((formData) => ({
          key: formData._key,
          type: formData._dataType,
          [formData._dataType === 'file' ? 'src' : 'value']: formData._value
        }))
      }
    }

    return {
      name: request.title,
      request: requestData
    }
  }

  const getCollectionData = (collection: collectionItem) => {
    return {
      info: {
        type: 'collection',
        name: collection.title,
        schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json'
      },
      item: [
        ...folderInCollection.map((folder) => getFolderData(folder)),
        ...requestInCollection.map((request) => getRequestData(request))
      ]
    }
  }

  return (
    <MenuItem onClick={(e) => handleExport(e)}>
      {/* Export 버튼 클릭 시, 해당 collection을 json 파일로 export */}
      <Typography textAlign="center">Export</Typography>
    </MenuItem>
  )
}
