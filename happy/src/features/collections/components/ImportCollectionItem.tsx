import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch } from '../../../app/hook'

import { folderItem } from '../../folders/domain/folderItem'
import folderService from '../../folders/service/folderService'
import collectionService from '../service/collectionService'
import { collectionItem } from '../domain/collectionItem'
import { requestItem } from '../../requests/domain/requestItem'
import requestService from '../../requests/service/requestService'

export default function ImportCollectionItem() {
  const [open, setOpen] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const { workspaceId } = useParams()
  const dispatch = useAppDispatch()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const navigate = useNavigate()
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Handle the dropped files here
    setSelectedFiles(acceptedFiles)
    readJsonFile(acceptedFiles[0])

    handleClose()
  }, [])

  const readJsonFile = (file: File) => {
    const reader = new FileReader()
    reader.readAsText(file)
    reader.onload = () => {
      const result = reader.result as string
      const jsonData = JSON.parse(result)
      console.log(jsonData)

      const info = jsonData.info
      const newCollection = new collectionItem()
      newCollection.title = info.name
      newCollection.id = info._postman_id
      newCollection.workspaceId = workspaceId ?? ''
      dispatch(collectionService.new(newCollection))

      navigate(`/workspaces/${workspaceId}/collections/${newCollection.id}`)

      const item = jsonData.item

      item.forEach((item: any) => {
        if (item.request) {
          const newRequest = new requestItem()
          newRequest.title = item.name
          newRequest.id = item.id
          newRequest.workspaceId = workspaceId ?? ''
          newRequest.parentId = newCollection.id
          newRequest.method = item.request.method
          //   newRequest.url = item.request.url
          //   newRequest.body = item.request.body
          //   newRequest.headers = item.request.header
          newRequest.response = item.response
          dispatch(requestService.new(newRequest))
        } else if (item) {
          const newFolder = new folderItem()
          newFolder.title = item.name
          newFolder.id = item.id
          newFolder.workspaceId = workspaceId ?? ''
          newFolder.parentId = newCollection.id
          dispatch(folderService.new(newFolder))

          item.item.forEach((item: any) => {
            if (item.item.request) {
              const newRequest = new requestItem()
              newRequest.title = item.name
              newRequest.id = item.id
              newRequest.workspaceId = workspaceId ?? ''
              newRequest.parentId = newFolder.id
              newRequest.method = item.request.method
              //   newRequest.url = item.request.url
              //   newRequest.body = item.request.body
              //   newRequest.headers = item.request.header
              newRequest.response = item.response
              dispatch(requestService.new(newRequest))
            } else if (item.item) {
              const newFolderInFolder = new folderItem()
              newFolderInFolder.title = item.name
              newFolderInFolder.id = item.item.id
              newFolderInFolder.workspaceId = workspaceId ?? ''
              newFolderInFolder.parentId = newFolder.id

              dispatch(folderService.new(newFolderInFolder))
            }
          })
        }
      })

      //   const folderList: folderItem[] = []
      //   const requestList: any[] = []

      //   item.forEach((item: any) => {
      //     if (item.item) {
      //       const folder = new folderItem()
      //       folder.title = item.name
      //       folder.id = item.id
      //         folder.workspaceId = workspaceId ?? ''
      //         folder.parentId = newCollection.id
      //         folderList.push(folder)
      //         folderList.forEach((folder) => {
      //           dispatch(folderService.new(folder))
      //         })

      //       console.log(item.item)
      //     } else {
      //       requestList.push(item)
      //     }
      //   })
    }
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1, accept: '.json' })

  return (
    <Box>
      <MenuItem>
        <Typography textAlign="center" sx={{ ml: 3 }} onClick={handleClickOpen}>
          Import Collection
        </Typography>
      </MenuItem>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
        <Box sx={{ width: 600, height: 500 }}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pr: 2
              }}
            >
              <DialogTitle>
                <Typography variant="h6" gutterBottom>
                  Upload Files
                </Typography>
              </DialogTitle>
            </Box>
            <DialogContent>
              <Box>
                <TextField
                  id="outlined-password-input"
                  label="Paste cURL, Raw text or URL..."
                  type="url
                  "
                  fullWidth
                  autoComplete="current-password"
                />
              </Box>
              <Box>
                {/* Dropzone area */}
                <Box
                  {...getRootProps()}
                  sx={{
                    height: '200%',
                    color: '#B5B8BC',
                    border: '2px dashed #ccc',
                    padding: '60px',
                    borderRadius: '4px',
                    mt: 5
                  }}
                >
                  <input {...getInputProps()} />
                  <UploadFileIcon />
                  <Typography variant="body2" textAlign="center">
                    Drag anywhere to import, or click to select files
                  </Typography>
                </Box>
              </Box>
            </DialogContent>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}
