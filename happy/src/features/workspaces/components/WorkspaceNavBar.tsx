import Breadcrumbs from '@mui/material/Breadcrumbs'
import { useAppDispatch, useAppSelector } from '../../../app/hook'
import { selectNavBarItemById } from '../../config/configSlice'
import WorkspaceNavBarItem from './WorkspaceNavBarItem'
import { Box } from '@mui/material'
import configService from '../../config/service/configService'
import { selectWorkspaceById } from '../service/workspaceSlice'
import { selectCollectionById } from '../../collections/service/collectionSlice'
import { selectFolderById } from '../../folders/service/folderSlice'
import { selectRequestById } from '../../requests/service/requestSlice'
import { useEffect } from 'react'

type WorkspaceNavBarProps = {
  _id: string
}

export default function WorkspaceNavBar(props: WorkspaceNavBarProps) {
  const dispatch = useAppDispatch()
  const workspace = useAppSelector((state) => selectWorkspaceById(state, props._id))
  const collection = useAppSelector((state) => selectCollectionById(state, props._id))
  const folder = useAppSelector((state) => selectFolderById(state, props._id))
  const request = useAppSelector((state) => selectRequestById(state, props._id))
  const targetItem = workspace || collection || folder || request
  const navBarItem = useAppSelector((state) => selectNavBarItemById(state, targetItem?.id ?? ''))

  useEffect(() => {
    dispatch(configService.navBarCreated(targetItem))
  }, [dispatch, targetItem])

  if (!navBarItem) {
    return null
  }

  return (
    <Box>
      <Breadcrumbs separator="/" aria-label="breadcrumb">
        {[...navBarItem.itemIdList].reverse().map((_id) => (
          <WorkspaceNavBarItem key={_id} _id={_id} />
        ))}
      </Breadcrumbs>
    </Box>
  )
}
