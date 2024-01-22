import { MenuItem, Typography } from '@mui/material'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectWorkspaceById } from '../service/workspaceSlice'
import { useNavigate } from 'react-router-dom'
import { selectAllCollections } from '../../collections/service/collectionSlice'
import { selectAllFolders } from '../../folders/service/folderSlice'
import { selectAllRequests } from '../../requests/service/requestSlice'
import { requestItem } from '../../requests/domain/requestItem'
import { runResultItem } from '../../runResults/domain/runResultItem'
import runResultService from '../../runResults/service/runResultService'
import { runTestItem } from '../../runTests/domain/runTestItem'
import runTestService from '../../runTests/service/runTestService'
import requestService from '../../requests/service/requestService'

type runWorkspaceOptionItemProps = {
  workspaceId: string
  handleClose: () => void
}

interface ResponseType {
  elapsed?: number
  body?: string
  status?: number
}
interface PayloadType {
  url: string
  method: string
  response?: ResponseType
  title?: string
  expectedResult?: string
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

    const newRunResult = new runResultItem()
    newRunResult.title = workspace.title
    newRunResult.workspaceId = workspace.id
    newRunResult.parentId = workspace?.id ?? ''
    newRunResult.created = Date.now()

    collection.forEach((collection) => {
      dfs(collection.id)
    })

    requestList.forEach(async (request) => {
      const response = await dispatch(requestService.send({ request: request, formFiles: [] }))
      const resBody = (response.payload as PayloadType)?.response?.body
      const resTitle = (response.payload as PayloadType)?.title
      const resStatus = (response.payload as PayloadType)?.response?.status
      const resExpectedResult = (response.payload as PayloadType)?.expectedResult

      const newRunTest = new runTestItem()
      newRunTest.title = resTitle || ''
      newRunTest.parentId = workspace?.id ?? ''
      newRunTest.requestId = request.id
      newRunTest.created = Date.now()
      newRunTest.status = resStatus || 0
      newRunTest.responseResult = resBody || ''
      newRunTest.expectedResult = resExpectedResult || ''
      dispatch(runTestService.new(newRunTest))
      newRunResult.runTestList?.push(newRunTest.id)
    })

    navigate(`/workspaces/${workspace.id}/runHistory`)
    dispatch(runResultService.new(newRunResult))
  }

  return (
    <MenuItem>
      {/* Run Workspace 버튼 클릭 시, 해당 workspace 내의 모든 request를 실행 */}
      <Typography textAlign="center" sx={{ ml: 4 }} onClick={handleRunClick}>
        Run Workspace
      </Typography>
    </MenuItem>
  )
}
