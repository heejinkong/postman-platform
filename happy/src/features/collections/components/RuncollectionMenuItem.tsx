import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { runTestItem } from '../../runTests/runTestItem'
import runTestService from '../../runTests/service/runTestService'
import { selectCollectionById } from '../collectionsSlice'
import { MenuItem, Typography } from '@mui/material'
import { selectAllRequests } from '../../requests/requestsSlice'
import { selectAllFolders } from '../../folders/foldersSlice'
import runResultService from '../../runResults/service/runResultService'
import { runResultItem } from '../../runResults/runResultItem'
import { useNavigate } from 'react-router-dom'

type runCollectionMenuItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function RunCollectionMenuItem(props: runCollectionMenuItemProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))

  const folders = useAppSelector(selectAllFolders).filter((folder) => {
    return folder.parentId === props.collectionId
  })
  const requestsByCollection = useAppSelector(selectAllRequests).filter((request) => {
    return request.parentId === props.collectionId
  })

  const requestsByFolder = useAppSelector(selectAllRequests).filter((request) => {
    return folders.some((folder) => folder.id === request.parentId)
  })

  const handleRunClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    const newRunResultItem = new runResultItem()
    newRunResultItem.title = collection.title
    newRunResultItem.parentId = collection?.id ?? ''
    newRunResultItem.created = Date.now()
    dispatch(runResultService.new(newRunResultItem))

    if (folders.length > 0) {
      folders.forEach(() => {
        if (requestsByFolder.length > 0) {
          requestsByFolder.forEach((request) => {
            const newRunTestItem = new runTestItem()
            newRunTestItem.title = request.title
            newRunTestItem.parentId = collection?.id ?? ''
            newRunTestItem.requestId = request.id
            newRunTestItem.created = Date.now()
            newRunTestItem.status = request.response.statusCode
            newRunTestItem.result = request.response.body
            dispatch(runTestService.new(newRunTestItem))
            newRunResultItem.runTestList?.push(newRunTestItem.id)
          })
        }
      })
    }

    if (requestsByCollection.length > 0) {
      requestsByCollection.forEach((request) => {
        const newRunTestItem = new runTestItem()
        newRunTestItem.title = request.title
        newRunTestItem.parentId = collection?.id ?? ''
        newRunTestItem.requestId = request.id
        newRunTestItem.created = Date.now()
        newRunTestItem.status = request.response.statusCode
        newRunTestItem.result = request.response.body
        dispatch(runTestService.new(newRunTestItem))
        newRunResultItem.runTestList?.push(newRunTestItem.id)
      })
    }
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
