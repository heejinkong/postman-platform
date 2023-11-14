import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectCollectionById } from '../collectionsSlice'
import collectionService from '../service/collectionService'
import { MenuItem, Typography } from '@mui/material'

type runCollectionMenuItemProps = {
  collectionId: string
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void
}

export default function RuncollectionMenuItem(props: runCollectionMenuItemProps) {
  const dispatch = useAppDispatch()

  const collection = useAppSelector((state) => selectCollectionById(state, props.collectionId))

  const handleRun = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    props.handleClose(e)

    dispatch(collectionService.run(collection))

    console.log('run collection')
  }

  return (
    <MenuItem onClick={(e) => handleRun(e)}>
      <Typography textAlign="center" sx={{ color: `#4caf50` }}>
        Run
      </Typography>
    </MenuItem>
  )
}
