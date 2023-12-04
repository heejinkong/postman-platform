import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { runTestItem } from '../../runTests/domain/runTestEntity'
import runTestService from '../../runTests/service/runTestService'
import { selectCollectionById } from '../service/collectionSlice'
import { MenuItem, Typography } from '@mui/material'
import { selectAllRequests } from '../../requests/service/requestSlice'
import { selectAllFolders } from '../../folders/service/folderSlice'
import runResultService from '../../runResults/service/runResultService'
import { runResultItem } from '../../runResults/domain/runResultEntity'
import { useNavigate } from 'react-router-dom'
import { requestItem } from '../../requests/domain/requestEntity'

type runCollectionMenuItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function RunCollectionMenuItem(props: runCollectionMenuItemProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))

  const folderInCollection = useAppSelector(selectAllFolders).filter((folder) => {
    return folder.parentId === props.collectionId
  })
  const folders = useAppSelector(selectAllFolders) ?? []
  const requests = useAppSelector(selectAllRequests) ?? []

  const requestList: requestItem[] = []

  const dfs = (folderId: string) => {
    const requestInFolder = requests.filter((request) => request.parentId === folderId)
    requestList.push(...requestInFolder)

    const subFolder = folders.filter((folder) => folder.parentId === folderId)
    if (subFolder.length > 0) {
      subFolder.forEach((folder) => {
        dfs(folder.id)
      })
    }
  }

  const handleRunClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    folderInCollection.forEach((folder) => {
      dfs(folder.id)
    })

    requests.forEach((request) => {
      if (request.parentId === props.collectionId) {
        requestList.push(request)
      }
    })

    const newRunResultItem = new runResultItem()
    newRunResultItem.title = collection.title
    newRunResultItem.workspaceId = collection.workspaceId
    newRunResultItem.parentId = collection?.id ?? ''
    newRunResultItem.created = Date.now()
    dispatch(runResultService.new(newRunResultItem))

    requestList.forEach((request) => {
      const newRunTestItem = new runTestItem()
      newRunTestItem.title = request.title
      newRunTestItem.parentId = collection?.id ?? ''
      newRunTestItem.requestId = request.id
      newRunTestItem.created = Date.now()
      newRunTestItem.status = request.response.status
      newRunTestItem.responseResult = request.response.body
      dispatch(runTestService.new(newRunTestItem))
      newRunResultItem.runTestList?.push(newRunTestItem.id)
    })

    // if (folders.length > 0) {
    //   folders.forEach(() => {
    //     if (requestsByFolder.length > 0) {
    //       requestsByFolder.forEach((request) => {
    //         const newRunTestItem = new runTestItem()
    //         newRunTestItem.title = request.title
    //         newRunTestItem.parentId = collection?.id ?? ''
    //         newRunTestItem.requestId = request.id
    //         newRunTestItem.created = Date.now()
    //         newRunTestItem.status = request.response.status
    //         newRunTestItem.responseResult = request.response.body
    //         dispatch(runTestService.new(newRunTestItem))
    //         newRunResultItem.runTestList?.push(newRunTestItem.id)
    //       })
    //     }
    //   })
    // }

    // if (requestsByCollection.length > 0) {
    //   requestsByCollection.forEach((request) => {
    //     const newRunTestItem = new runTestItem()
    //     newRunTestItem.title = request.title
    //     newRunTestItem.parentId = collection?.id ?? ''
    //     newRunTestItem.requestId = request.id
    //     newRunTestItem.created = Date.now()
    //     newRunTestItem.status = request.response.status
    //     newRunTestItem.responseResult = request.response.body
    //     dispatch(runTestService.new(newRunTestItem))
    //     newRunResultItem.runTestList?.push(newRunTestItem.id)
    //   })
    // }
    navigate(`/workspaces/${collection.workspaceId}/runHistory`)
  }

  return (
    <MenuItem>
      <Typography textAlign="center" sx={{ color: `#4caf50` }} onClick={handleRunClick}>
        Run Collection
      </Typography>
    </MenuItem>
  )
}
