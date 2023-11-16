import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { runTestItem } from '../../runTests/service/runTestItem'
import runTestService from '../../runTests/service/runTestService'
import { selectCollectionById } from '../collectionsSlice'
import { MenuItem, Typography } from '@mui/material'
import { selectAllRequests } from '../../requests/requestsSlice'

type runCollectionMenuItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function RunCollectionMenuItem(props: runCollectionMenuItemProps) {
  const dispatch = useAppDispatch()

  // const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))
  // const requests = useAppSelector(selectAllRequests).filter((request) => {
  //   return request.parentId === props.collectionId
  // })
  // const handleRunClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
  //   props.handleClose(e)
  //   requests.forEach((request) => {
  //     const newRunTestItem = new runTestItem()
  //     newRunTestItem.title = request.title
  //     newRunTestItem.parentId = collection?.id ?? ''
  //     newRunTestItem.requestId = request.id

  //     dispatch(runTestService.new(newRunTestItem))
  //     console.log(newRunTestItem)
  //   })
  // }

  return (
    <MenuItem>
      <Typography textAlign="center" sx={{ color: `#4caf50` }}>
        Run Collection
      </Typography>
    </MenuItem>
  )
}
