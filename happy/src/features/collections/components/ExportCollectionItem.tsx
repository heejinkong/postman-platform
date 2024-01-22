import { MenuItem, Typography } from '@mui/material'
import { selectCollectionById } from '../service/collectionSlice'
import { useAppSelector } from '../../../app/hook'
import { collectionItem } from '../domain/collectionItem'
import { selectAllFolders } from '../../folders/service/folderSlice'
import { folderItem } from '../../folders/domain/folderItem'
import { requestItem } from '../../requests/domain/requestItem'
import { selectAllRequests } from '../../requests/service/requestSlice'

type ExportCollectionItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function ExportCollectionItem(props: ExportCollectionItemProps) {
  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))
  const folders = useAppSelector(selectAllFolders) ?? []
  const requests = useAppSelector(selectAllRequests) ?? []

  // const requestList: requestItem[] = []
  // const subFolderList: folderItem[] = []

  const folderInCollection = folders.filter((folder) => folder.parentId === props.collectionId)

  const requestInCollection = requests.filter((request) => request.parentId === props.collectionId)

  // const dfs = (folderId: string): { requestList: requestItem[]; subFolderList: folderItem[] } => {
  //   const requestInFolder = requests.filter((request) => request.parentId === folderId)
  //   requestList.push(...requestInFolder)

  //   const subFolder = folders.filter((folder) => folder.parentId === folderId)
  //   if (subFolder.length > 0) {
  //     subFolder.forEach((folder) => {
  //       const { requestList: subFolderRequests, subFolderList: nestedSubFolders } = dfs(folder.id)
  //       requestList.push(...subFolderRequests)
  //       subFolderList.push(...nestedSubFolders, folder)
  //     })
  //   }

  //   return { requestList, subFolderList }
  // }

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
    const subFolder = folders.filter((subFolder) => subFolder.parentId === folder.id)
    const requestInSubFolder = requests.filter((request) => request.parentId === folder.id)

    if (subFolder.length > 0) {
      return subFolder.map((subFolder) => ({
        name: subFolder.title,
        item: getSubFolderData(subFolder)
      }))
    } else {
      return requestInSubFolder.map((request) => ({
        name: request.title,
        item: getRequestData(request)
      }))
    }
  }

  const getFolderData = (folder: folderItem) => {
    const requestInFolder = requests.filter((request) => request.parentId === folder.id)
    const subFolderInFolder = folders.filter((subFolder) => subFolder.parentId === folder.id)

    return {
      name: folder.title,
      item: [
        ...requestInFolder.map((request) => getRequestData(request)),
        ...subFolderInFolder.map((subFolder) => getSubFolderData(subFolder))
      ]
    }
  }

  interface ParsedUrl {
    protocol: string
    host: string
    path: string[]
  }

  function parseUrl(url: string): ParsedUrl | undefined {
    const regex = /^(https?:\/\/)?([^\/]+)(\/.*)?$/
    const match = url.match(regex)
    if (!match) {
      return undefined
    }
    const [, protocol, host, path] = match
    const pathArray = path ? path.split('/').filter((item) => item) : []
    return {
      protocol: protocol || 'http://',
      host,
      path: pathArray
    }
  }

  const getRequestData = (request: requestItem) => {
    const parsedUrl = parseUrl(request.url)

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
        protocol: parsedUrl?.protocol.split(':')[0] ?? '',
        host: parsedUrl?.host ?? '',
        path: parsedUrl?.path ?? [],
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
      <Typography textAlign="center">Export</Typography>
    </MenuItem>
  )
}
