import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { MenuItem, Typography } from '@mui/material'
import { selectFolderById } from '../foldersSlice'
import { runTestItem } from '../../runTests/runTestItem'
import { selectAllRequests } from '../../requests/requestsSlice'
import runTestService from '../../runTests/service/runTestService'
import { useNavigate } from 'react-router-dom'

type runFolderMenuItemProps = {
  parentId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function RunFolderMenuItem(props: runFolderMenuItemProps) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const folder = useAppSelector((state) => selectFolderById(state, props.parentId))
  const requests = useAppSelector(selectAllRequests).filter((request) => {
    return request.parentId === props.parentId
  })
  const handleRunClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    requests.forEach((request) => {
      const newRunTestItem = new runTestItem()
      newRunTestItem.title = folder.title + ' - ' + request.title
      newRunTestItem.parentId = folder?.id ?? ''
      newRunTestItem.requestId = request.id
      newRunTestItem.created = Date.now()
      newRunTestItem.status = request.response.statusCode
      newRunTestItem.result = request.response.body
      dispatch(runTestService.new(newRunTestItem))

      navigate(`/workspaces/${folder.workspaceId}/runResult/${newRunTestItem.id}`)
    })
  }

  return (
    <MenuItem onClick={(e) => handleRunClick(e)}>
      <Typography textAlign="center" sx={{ color: `#4CAF50` }}>
        Run Folder
      </Typography>
    </MenuItem>
  )
}