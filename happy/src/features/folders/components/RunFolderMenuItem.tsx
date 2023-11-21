import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { MenuItem, Typography } from '@mui/material'
import { selectAllFolders, selectFolderById } from '../service/foldersSlice'
import { runTestItem } from '../../runTests/domain/runTestEntity'
import { selectAllRequests } from '../../requests/service/requestsSlice'
import runTestService from '../../runTests/service/runTestService'
import { useNavigate } from 'react-router-dom'
import { selectCollectionById } from '../../collections/service/collectionsSlice'
import { runResultItem } from '../../runResults/domain/runResultEntity'
import runResultService from '../../runResults/service/runResultService'

type runFolderMenuItemProps = {
  parentId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function RunFolderMenuItem(props: runFolderMenuItemProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const folder = useAppSelector((state) => selectFolderById(state, props.parentId))

  const collection = useAppSelector((state) => selectCollectionById(state, folder?.parentId ?? ''))

  const folders = useAppSelector(selectAllFolders).filter((folder) => {
    return folder.parentId === props.parentId
  })

  const requests = useAppSelector(selectAllRequests).filter((request) => {
    return request.parentId === props.parentId
  })

  const handleRunClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    const newRunResultItem = new runResultItem()
    newRunResultItem.title = collection.title
    newRunResultItem.workspaceId = folder.workspaceId
    newRunResultItem.parentId = folder?.id ?? ''
    newRunResultItem.created = Date.now()
    dispatch(runResultService.new(newRunResultItem))

    if (requests.length > 0) {
      requests.forEach((request) => {
        const newRunTestItem = new runTestItem()
        newRunTestItem.title = request.title
        newRunTestItem.parentId = folder?.id ?? ''
        newRunTestItem.requestId = request.id
        newRunTestItem.created = Date.now()
        newRunTestItem.status = request.response.status
        newRunTestItem.responseResult = request.response.body
        dispatch(runTestService.new(newRunTestItem))
        newRunResultItem.runTestList?.push(newRunTestItem.id)
      })
    }
    navigate(`/workspaces/${folder.workspaceId}/runResult/${newRunResultItem.id}`)
  }

  return (
    <MenuItem onClick={(e) => handleRunClick(e)}>
      <Typography textAlign="center" sx={{ color: `#4CAF50` }}>
        Run Folder
      </Typography>
    </MenuItem>
  )
}
