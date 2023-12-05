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
    // requestInFolder.forEach((request) => {
    //   dispatch(runResultService.runRequest(request))
    // })

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

    const newRunResult = new runResultItem()
    newRunResult.title = workspace.title
    newRunResult.workspaceId = workspace.id
    newRunResult.parentId = workspace?.id ?? ''
    newRunResult.created = Date.now()
    dispatch(runResultService.new(newRunResult))

    requestList.forEach((request) => {
      const newRunTest = new runTestItem()
      newRunTest.title = request.title
      newRunTest.parentId = workspace?.id ?? ''
      newRunTest.requestId = request.id
      newRunTest.created = Date.now()
      dispatch(runTestService.new(newRunTest))
      newRunResult.runTestList?.push(newRunTest.id)
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
