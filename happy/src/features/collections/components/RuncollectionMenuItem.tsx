import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { runTestItem } from '../../runTests/domain/runTestItem'
import runTestService from '../../runTests/service/runTestService'
import { selectCollectionById } from '../service/collectionSlice'
import { MenuItem, Typography } from '@mui/material'
import { selectAllRequests } from '../../requests/service/requestSlice'
import { selectAllFolders } from '../../folders/service/folderSlice'
import runResultService from '../../runResults/service/runResultService'
import { runResultItem } from '../../runResults/domain/runResultItem'
import { useNavigate } from 'react-router-dom'
import { requestItem } from '../../requests/domain/requestItem'
import requestService from '../../requests/service/requestService'

type runCollectionMenuItemProps = {
  collectionId: string
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
    const newRunResult = new runResultItem()
    newRunResult.title = collection.title
    newRunResult.workspaceId = collection.workspaceId
    newRunResult.parentId = collection?.id ?? ''
    newRunResult.created = Date.now()

    folderInCollection.forEach((folder) => {
      dfs(folder.id)
    })

    requests.forEach((request) => {
      if (request.parentId === props.collectionId) {
        requestList.push(request)
      }
    })

    let runNum = 0

    requestList.forEach(async (request) => {
      const response = await dispatch(requestService.send({ request: request, formFiles: [] }))
      const resBody = (response.payload as PayloadType)?.response?.body
      const resTitle = (response.payload as PayloadType)?.title
      const resStatus = (response.payload as PayloadType)?.response?.status
      const resExpectedResult = (response.payload as PayloadType)?.expectedResult

      const newRunTest = new runTestItem()
      newRunTest.title = resTitle || ''
      newRunTest.parentId = collection?.id ?? ''
      newRunTest.requestId = request.id
      newRunTest.created = Date.now()
      newRunTest.status = resStatus || 0
      newRunTest.responseResult = resBody || ''
      newRunTest.expectedResult = resExpectedResult || ''
      dispatch(runTestService.new(newRunTest))
      newRunResult.runTestList?.push(newRunTest.id)

      if (
        (resStatus === 200 || resStatus === 201) &&
        (resExpectedResult === '' || resExpectedResult === resBody)
      ) {
        runNum++
      } else {
        runNum--
      }
    })
    if (runNum === requestList.length) {
      newRunResult.runResult = 1
    } else {
      newRunResult.runResult = -1
    }
    dispatch(runResultService.new(newRunResult))

    navigate(`/workspaces/${collection.workspaceId}/runHistory`)
  }

  return (
    <MenuItem>
      {/* Run 버튼 클릭 시, 해당 collection 실행 */}
      <Typography textAlign="center" sx={{ color: `#4caf50` }} onClick={handleRunClick}>
        Run Collection
      </Typography>
    </MenuItem>
  )
}
