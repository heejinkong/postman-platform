import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Dialog, DialogContent, DialogTitle, MenuItem, TextField, Typography, Button, Alert } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useNavigate, useParams } from 'react-router-dom';

import { useAppDispatch } from '../../../app/hook';
import { folderItem } from '../../folders/domain/folderItem';
import folderService from '../../folders/service/folderService';
import collectionService from '../service/collectionService';
import { collectionItem } from '../domain/collectionItem';
import { requestItem } from '../../requests/domain/requestItem';
import requestService from '../../requests/service/requestService';
import { v4 as uuidv4 } from 'uuid';

type FormData = {
  key: string;
  src: string;
  value: string;
  type: string;
  disabled: boolean;
}[];
type Raw = {
  options: {
    raw: {
      language: string;
    };
  };
  raw: {
    data: string;
  };
};

type ExportedItem = {
  id: string;
  name: string;
  request?: {
    body:
      | {
          mode: 'formdata';
          formdata?: FormData;
        }
      | {
          mode: 'raw';
          raw: Raw;
        };

    header: {
      key: string;
      value: string;
      disabled: boolean;
    }[];

    method: string;
    url: {
      raw: string;
      protocol: string;
      host: string[];
      port: string;
      path: string[];
      query: {
        key: string;
        value: string;
        disabled: boolean;
      }[];
    };
    response: string[];
  };
  item?: ExportedItem[];
};

export default function ImportCollectionItem() {
  const [open, setOpen] = React.useState(false);
  const [, setSelectedFiles] = useState<File[]>([]);

  const [invalidFileAlert, setInvalidFileAlert] = useState(false);

  const { workspaceId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const readJsonFile = (file: File) => {
        if (file.name.toLowerCase().endsWith('.json')) {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = () => {
            const result = reader.result as string;
            const jsonData = JSON.parse(result);

            const info = jsonData.info;
            const newCollection = new collectionItem();
            newCollection.title = info.name;
            newCollection.id = info._postman_id;
            newCollection.workspaceId = workspaceId ?? '';
            dispatch(collectionService.new(newCollection));

            navigate(`/workspaces/${workspaceId}/collections/${newCollection.id}`);

            const item = jsonData.item;

            const itemData = (item: ExportedItem, parentId: string) => {
              if (item.request) {
                const newRequest = new requestItem();
                newRequest.title = item.name;
                newRequest.id = item.id;
                newRequest.workspaceId = workspaceId ?? '';
                newRequest.parentId = parentId;
                newRequest.method = item.request.method;
                newRequest.url = item.request.url.raw;

                // console.log(item.request.url.query);
                if (item.request.url.query) {
                  const checkedParams = item.request.url.query.filter((param) => !param.disabled);
                  const nonCheckedParams = item.request.url.query.filter((param) => param.disabled);

                  if (checkedParams.length > 0) {
                    checkedParams.forEach((param) => {
                      const newParamId = uuidv4();
                      newRequest.paramsSelection.push(newParamId);

                      newRequest.params.push({
                        id: newParamId,
                        _key: param.key,
                        _value: param.value,
                        _desc: '',
                      });
                    });
                  }
                  if (nonCheckedParams.length > 0) {
                    nonCheckedParams.forEach((param) => {
                      if (!newRequest.paramsSelection.includes(uuidv4())) {
                        newRequest.params.push({
                          id: uuidv4(),
                          _key: param.key,
                          _value: param.value,
                          _desc: '',
                        });
                      }
                    });
                  }
                }
                if (item.request.header) {
                  const checkedHeaders = item.request.header.filter((header) => !header.disabled);

                  checkedHeaders.forEach((header) => {
                    const newHeaderId = uuidv4();
                    newRequest.headersSelection.push(newHeaderId);

                    newRequest.headers.push({
                      id: newHeaderId,
                      _key: header.key,
                      _value: header.value,
                      _desc: '',
                    });
                  });
                }

                if (item.request.body) {
                  const body = item.request.body;
                  newRequest.body.mode = body.mode as 'formdata' | 'raw';

                  if (body.mode === 'formdata' && body.formdata) {
                    const checkedBody = body['formdata'].filter((body) => !body.disabled);
                    const nonCheckedBody = body['formdata'].filter((body) => body.disabled);

                    if (checkedBody.length > 0) {
                      checkedBody.forEach((formData) => {
                        const newFormDataId = uuidv4();
                        newRequest.body.formDataSelection.push(newFormDataId);

                        newRequest.body.formData.push({
                          id: newFormDataId,
                          _key: formData.key,
                          _dataType: formData.type,
                          _value: [formData.src || formData.value],
                          _desc: '',
                        });
                      });
                    }
                    if (nonCheckedBody.length > 0) {
                      nonCheckedBody.forEach((formData) => {
                        if (!newRequest.body.formDataSelection.includes(uuidv4())) {
                          newRequest.body.formData.push({
                            id: uuidv4(),
                            _key: formData.key,
                            _dataType: formData.type,
                            _value: [formData.src || formData.value],
                            _desc: '',
                          });
                        }
                      });
                    }
                  } else if (body.mode === 'raw' && body.raw) {
                    newRequest.body.rawType = body.raw.options.raw.language;
                    newRequest.body.rawData = body.raw.raw.data;
                  }
                }

                newRequest.parentId = parentId;

                dispatch(requestService.new(newRequest));
              } else if (item.item) {
                const newFolder = new folderItem();
                newFolder.title = item.name;
                newFolder.id = item.id;
                newFolder.workspaceId = workspaceId ?? '';
                newFolder.parentId = parentId;
                dispatch(folderService.new(newFolder));

                item.item.forEach((subItem) => {
                  itemData(subItem, newFolder.id);
                });
              }
            };

            item.forEach((item: ExportedItem) => {
              itemData(item, newCollection.id);
            });
          };
        } else {
          setInvalidFileAlert(true);
        }
      };

      setSelectedFiles(acceptedFiles);
      readJsonFile(acceptedFiles[0]);
      if (acceptedFiles[0].name.toLowerCase().endsWith('.json')) {
        handleClose();
      }
    },
    [dispatch, navigate, workspaceId],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    // accept: '.json',
  });

  return (
    <Box>
      <MenuItem>
        <Typography textAlign='center' onClick={handleClickOpen}>
          Import Collection
        </Typography>
      </MenuItem>
      <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title'>
        <Box sx={{ width: 600, height: 451 }}>
          <Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                pr: 2,
              }}
            >
              <DialogTitle>
                <Typography variant='h6' sx={{ fontSize: '20px' }}>
                  Upload Files
                </Typography>
              </DialogTitle>
            </Box>
            <DialogContent sx={{ padding: '8px 24px 0' }}>
              <Box>
                <TextField
                  id='outlined-password-input'
                  label='Enter URL or Paste text.'
                  type='url'
                  fullWidth
                  autoComplete='current-password'
                />
              </Box>
              <Box
                sx={{
                  height: '237px',
                  color: '#B5B8BC',
                  border: '2px dashed #ccc',
                  mt: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: '5px',
                }}
              >
                {/* Dropzone area */}
                <Box {...getRootProps()}>
                  <input {...getInputProps()} />
                  <UploadFileIcon sx={{ width: '32px', height: '32px' }} />
                  <Typography sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>File Upload</Typography>
                  <Typography variant='body2' sx={{ fontSize: '14px' }}>
                    Drag anywhere to import, or click to select files
                  </Typography>
                  <Button
                    className='btnWhite'
                    variant='contained'
                    size='small'
                    sx={{
                      fontSize: '14px',
                      color: '#1877F2 !important',
                      borderColor: 'rgba(195, 198, 201, 1) !important',
                      mt: '20px',
                    }}
                  >
                    Select Files
                  </Button>
                </Box>
              </Box>
              <Box
                sx={{
                  marginTop: '16px',
                  display: 'flex',
                  justifyContent: 'flex-end',
                }}
              >
                <Button className='btnWhite' variant='contained' size='small' onClick={handleClose}>
                  Cancle
                </Button>
              </Box>
            </DialogContent>
          </Box>
        </Box>
        {invalidFileAlert && (
          <Alert
            variant='filled'
            severity='error'
            onClose={() => setInvalidFileAlert(false)}
            sx={{ position: 'fixed', bottom: 16, right: '60px' }}
          >
            Incorrect format.
          </Alert>
        )}
      </Dialog>
    </Box>
  );
}
