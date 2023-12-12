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
import requestService from '../../requests/service/requestService'

type runFolderMenuItemProps = {
  parentId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
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
    const newRunResult = new runResultItem()
    newRunResult.title = folder.title
    newRunResult.workspaceId = folder.workspaceId
    newRunResult.parentId = folder?.id ?? ''
    newRunResult.created = Date.now()

    dfs(folder?.id ?? '')

    requestList.forEach(async (request) => {
      const response = await dispatch(requestService.send(request))
      const resBody = (response.payload as PayloadType)?.response?.body
      const resTitle = (response.payload as PayloadType)?.title
      const resStatus = (response.payload as PayloadType)?.response?.status
      const resExpectedResult = (response.payload as PayloadType)?.expectedResult

      const newRunTest = new runTestItem()
      newRunTest.title = resTitle || ''
      newRunTest.parentId = folder?.parentId ?? ''
      newRunTest.requestId = request.id
      newRunTest.created = Date.now()
      newRunTest.status = resStatus || 0
      newRunTest.responseResult = resBody || ''
      newRunTest.expectedResult = resExpectedResult || ''
      dispatch(runTestService.new(newRunTest))
      newRunResult.runTestList?.push(newRunTest.id)
    })

    dispatch(runResultService.new(newRunResult))

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
