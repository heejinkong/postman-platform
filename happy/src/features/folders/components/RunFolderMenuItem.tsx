import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { MenuItem, Typography } from '@mui/material'
import { selectAllFolders, selectFolderById } from '../service/folderSlice'
import { runTestItem } from '../../runTests/domain/runTestEntity'
import { selectAllRequests } from '../../requests/service/requestSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { runResultItem } from '../../runResults/domain/runResultEntity'
import runResultService from '../../runResults/service/runResultService'
import { requestItem } from '../../requests/domain/requestEntity'
import runTestService from '../../runTests/service/runTestService'

type runFolderMenuItemProps = {
  parentId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function RunFolderMenuItem(props: runFolderMenuItemProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  const folder = useAppSelector((state) => selectFolderById(state, props.parentId))

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

    dfs(folder?.id ?? '')

    const newRunResultItem = new runResultItem()
    newRunResultItem.title = folder.title
    newRunResultItem.workspaceId = folder.workspaceId
    newRunResultItem.parentId = folder?.id ?? ''
    newRunResultItem.created = Date.now()
    dispatch(runResultService.new(newRunResultItem))

    requestList.forEach((request) => {
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

    // if (requests.length > 0) {
    //   requests.forEach((request) => {
    //     const newRunTestItem = new runTestItem()
    //     newRunTestItem.title = request.title
    //     newRunTestItem.parentId = folder?.id ?? ''
    //     newRunTestItem.requestId = request.id
    //     newRunTestItem.created = Date.now()
    //     newRunTestItem.status = request.response.status
    //     newRunTestItem.responseResult = request.response.body
    //     dispatch(runTestService.new(newRunTestItem))
    //     newRunResultItem.runTestList?.push(newRunTestItem.id)
    //   })
    // }
    navigate(`/workspaces/${workspaceId}/runHistory`)
  }

  return (
    <MenuItem onClick={(e) => handleRunClick(e)}>
      <Typography textAlign="center" sx={{ color: `#4CAF50` }}>
        Run Folder
      </Typography>
    </MenuItem>
  )
}
