import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography
} from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useNavigate, useParams } from 'react-router-dom'

import { useAppDispatch } from '../../../app/hook'
import { folderItem } from '../../folders/domain/folderItem'
import folderService from '../../folders/service/folderService'
import collectionService from '../service/collectionService'
import { collectionItem } from '../domain/collectionItem'
import { requestItem } from '../../requests/domain/requestItem'
import requestService from '../../requests/service/requestService'
import { v4 as uuidv4 } from 'uuid'

export default function ImportCollectionItem() {
  const [open, setOpen] = React.useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [textFieldValue, setTextFieldValue] = useState('')
  const [dialogReset, setDialogReset] = useState(0) // 추가된 부분

  const { workspaceId } = useParams()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleCancel = () => {
    setTextFieldValue('')
    setDialogReset((prev) => prev + 1)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
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

      const info = jsonData.info
      const newCollection = new collectionItem()
      newCollection.title = info.name
      newCollection.id = info._postman_id
      newCollection.workspaceId = workspaceId ?? ''
      dispatch(collectionService.new(newCollection))

      navigate(`/workspaces/${workspaceId}/collections/${newCollection.id}`)

      const item = jsonData.item
      console.log(item)

      const processItem = (item, parentId: string) => {
        if (item.request) {
          const newRequest = new requestItem()
          newRequest.title = item.name
          newRequest.id = item.id
          newRequest.workspaceId = workspaceId ?? ''
          newRequest.parentId = parentId
          newRequest.method = item.request.method
          newRequest.url = item.request.url.raw

          if (item.request.url.query) {
            const checkedParams = item.request.url.query.filter((param: any) => !param.disabled)
            const nonCheckedParams = item.request.url.query.filter((param: any) => param.disabled)

            if (checkedParams.length > 0) {
              checkedParams.forEach((param: any) => {
                const newParamId = uuidv4()
                newRequest.paramsSelection.push(newParamId)

                newRequest.params.push({
                  id: newParamId,
                  _key: param.key,
                  _value: param.value,
                  _desc: ''
                })
              })
            }
            if (nonCheckedParams.length > 0) {
              nonCheckedParams.forEach((param: any) => {
                // const newParamId = uuidv4()

                if (!newRequest.paramsSelection.includes(uuidv4())) {
                  newRequest.params.push({
                    id: uuidv4(),
                    _key: param.key,
                    _value: param.value,
                    _desc: ''
                  })
                }
              })
            }

            console.log(newRequest.paramsSelection)
          }
          if (item.request.header) {
            const checkedHeaders = item.request.header.filter((header: any) => !header.disabled)

            checkedHeaders.forEach((header: any) => {
              const newHeaderId = uuidv4()
              newRequest.headersSelection.push(newHeaderId)

              newRequest.headers.push({
                id: newHeaderId,
                _key: header.key,
                _value: header.value,
                _desc: ''
              })
            })
          }

          if (item.request.body) {
            const body = item.request.body
            newRequest.body.mode = body.mode

            if (body.mode === 'formdata' && body.formdata) {
              newRequest.body.formData = body.formdata.map((formData: any) => ({
                id: uuidv4(),
                _key: formData.key,
                _dataType: formData.type,
                _value: [formData.src || formData.value],
                _desc: ''
              }))
            } else if (body.mode === 'raw' && body.raw) {
              newRequest.body.rawType = body.raw.options.raw.language
              newRequest.body.rawData = body.raw.raw.data
            }
          }

          newRequest.response = item.response
          dispatch(requestService.new(newRequest))
        } else if (item.item) {
          const newFolder = new folderItem()
          newFolder.title = item.name
          newFolder.id = item.id
          newFolder.workspaceId = workspaceId ?? ''
          newFolder.parentId = parentId
          dispatch(folderService.new(newFolder))

          item.item.forEach((subItem: any) => {
            processItem(subItem, newFolder.id)
          })
        }
      }

      item.forEach((item: any) => {
        processItem(item, newCollection.id)
      })
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: '.json',
    key: dialogReset // 추가된 부분
  })

  const handleTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextFieldValue(event.target.value)
  }

  return (
    <Box>
      <MenuItem>
        <Typography textAlign="center" sx={{ ml: 3 }} onClick={handleClickOpen}>
          Import Collection
        </Typography>
      </MenuItem>
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title">
        <Box sx={{ width: 600, height: textFieldValue.length > 10 ? 500 : 500 }}>
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
                  type="url"
                  fullWidth
                  autoComplete="current-password"
                  value={textFieldValue}
                  onChange={handleTextFieldChange}
                  multiline
                  rows={textFieldValue.length > 10 ? 13 : 1}
                />
                {textFieldValue.length > 10 && (
                  <DialogActions sx={{ padding: '10px 2px', width: '100%' }}>
                    <Button
                      sx={{ padding: '8px 22px', fontSize: '15px !important' }}
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      sx={{ padding: '8px 22px', fontSize: '15px !important' }}
                      className="btnBlue"
                      onClick={handleClose}
                    >
                      Import
                    </Button>
                  </DialogActions>
                )}
              </Box>
              <Box>
                {/* Dropzone area */}
                {textFieldValue.length <= 10 && (
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
                )}
              </Box>
            </DialogContent>
          </Box>
        </Box>
      </Dialog>
    </Box>
  )
}
