import { MenuItem, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectWorkspaceById } from '../service/workspaceSlice'
import { useNavigate } from 'react-router-dom'
import { selectAllCollections } from '../../collections/service/collectionSlice'
import { selectAllFolders } from '../../folders/service/folderSlice'
import { selectAllRequests } from '../../requests/service/requestSlice'
import { requestItem } from '../../requests/domain/requestEntity'
import { runResultItem } from '../../runResults/domain/runResultEntity'
import runResultService from '../../runResults/service/runResultService'
import { runTestItem } from '../../runTests/domain/runTestEntity'
import runTestService from '../../runTests/service/runTestService'

type runWorkspaceOptionItemProps = {
  workspaceId: string
  handleClose: () => void
}

export default function RunWorkspaceOptionItem(props: runWorkspaceOptionItemProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const workspace = useAppSelector((state) => selectWorkspaceById(state, props.workspaceId))

  const collection = useAppSelector(selectAllCollections).filter((collection) => {
    return collection.workspaceId === props.workspaceId
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

  const handleRunClick = () => {
    props.handleClose()

    collection.forEach((collection) => {
      dfs(collection.id)
    })

    const newRunResultItem = new runResultItem()
    newRunResultItem.title = workspace.title
    newRunResultItem.workspaceId = workspace.id
    newRunResultItem.parentId = workspace?.id ?? ''
    newRunResultItem.created = Date.now()
    dispatch(runResultService.new(newRunResultItem))

    requestList.forEach((request) => {
      const newRunTestItem = new runTestItem()
      newRunTestItem.title = request.title
      newRunTestItem.parentId = workspace?.id ?? ''
      newRunTestItem.requestId = request.id
      newRunTestItem.created = Date.now()
      dispatch(runTestService.new(newRunTestItem))
      newRunResultItem.runTestList?.push(newRunTestItem.id)
    })

    navigate(`/workspaces/${workspace.id}/runHistory`)
  }

  return (
    <MenuItem>
      <Typography textAlign="center" sx={{ ml: 4 }} onClick={handleRunClick}>
        Run Workspace
      </Typography>
    </MenuItem>
  )
}
