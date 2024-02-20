// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { MenuItem, Typography } from '@mui/material';
import { useAppSelector } from '../../../app/hook';
import { selectAllCollections } from '../service/collectionSlice';
import { collectionItem } from '../domain/collectionItem';
import { selectAllFolders } from '../../folders/service/folderSlice';
import { selectAllRequests } from '../../requests/service/requestSlice';
import { folderItem } from '../../folders/domain/folderItem';
import { requestItem } from '../../requests/domain/requestItem';

type ExportAllCollectionItemProps = {
  workspaceId: string;
  handleClose: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
};

interface ParsedUrl {
  protocol: string;
  host: string;
  path: string[];
}

//workspaceId 가진 모든 collection을 export하는 기능
export default function ExportAllCollectionItem(props: ExportAllCollectionItemProps) {
  const allCollection = useAppSelector(selectAllCollections).filter((collection) => {
    return collection.workspaceId === props.workspaceId;
  });

  const folders = useAppSelector(selectAllFolders) ?? [];
  const requests = useAppSelector(selectAllRequests) ?? [];

  const handleExport = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    exportCollectionToJson(props.workspaceId, allCollection);

    props.handleClose(e);
  };

  const exportCollectionToJson = (collectionId: string, allCollection: collectionItem[]) => {
    const collectionData = getCollectionData(allCollection);
    const jsonData = JSON.stringify(collectionData, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `collection_${collectionId}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFolderData = (folder: folderItem) => {
    const requestInFolder = requests.filter((request) => request.parentId === folder.id);
    const subFolderInFolder = folders.filter((subFolder) => subFolder.parentId === folder.id);

    const subFolderData = subFolderInFolder.map((subFolder) => getSubFolderData(subFolder));
    if (subFolderData.length > 0) {
      return {
        name: folder.title,
        item: [...requestInFolder.map((request) => getRequestData(request)), ...subFolderData],
      };
    } else {
      return {
        name: folder.title,
        item: requestInFolder.map((request) => getRequestData(request)),
      };
    }
  };

  const getSubFolderData = (folder: folderItem) => {
    const requestInSubFolder = requests.filter((request) => request.parentId === folder.id);
    const subFolderInSubFolder = folders.filter((subFolder) => subFolder.parentId === folder.id);

    const subFolderData = subFolderInSubFolder.map((subFolder) => getSubFolderData(subFolder));

    if (subFolderData.length > 0) {
      return {
        name: folder.title,
        item: [...requestInSubFolder.map((request) => getRequestData(request)), ...subFolderData],
      };
    } else {
      return {
        name: folder.title,
        item: requestInSubFolder.map((request) => getRequestData(request)),
      };
    }
  };

  function parseUrl(url: string): ParsedUrl | undefined {
    const regex = /^(https?:\/\/)?([^/\s]+)\/([^?]+)/;

    const match = url.match(regex);

    if (!match) {
      return undefined;
    }

    const [, protocol, host, path] = match;
    const pathArray = path ? path.split('/').filter((item) => item) : [];

    return {
      protocol: protocol || 'http://',
      host,
      path: pathArray,
    };
  }

  const getRequestData = (request: requestItem) => {
    const parsedUrl = parseUrl(request.url);
    const requestData = {
      method: request.method,
      header: [...request.headers.map((header) => ({ key: header._key, value: header._value }))],
      body: {},
      url: {
        raw: request.url,
        protocol: parsedUrl?.protocol.split(':')[0] ?? '',
        host: parsedUrl?.host ?? '',
        path: parsedUrl?.path ?? [],
        query: request.params.map((params) => ({
          key: params._key,
          value: params._value,
          ...(request.paramsSelection.includes(params.id) ? {} : { disabled: true }),
        })),
      },
      response: [],
    };

    if (request.body.mode === 'raw') {
      requestData.body = {
        mode: 'raw',
        raw: { data: request.body.rawData },
        options: {
          raw: {
            language: request.body.rawType,
          },
        },
      };
    } else if (request.body.mode === 'formdata') {
      requestData.body = {
        mode: 'formdata',
        formdata: request.body.formData.map((formData) => ({
          key: formData._key,
          type: formData._dataType,
          [formData._dataType === 'file' ? 'src' : 'value']: formData._value,
          ...(request.body.formDataSelection.includes(formData.id) ? {} : { disabled: true }),
        })),
      };
    }

    return {
      name: request.title,
      request: requestData,
    };
  };

  const getCollectionData = (collections: collectionItem[]) => {
    return collections.map((collection) => {
      const filteredFolders = folders.filter((folder) => folder.parentId === collection.id);
      const filteredRequests = requests.filter((request) => request.parentId === collection.id);
      return {
        info: {
          type: 'collection',
          name: collection.title,
          schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
        },
        item: [
          ...filteredFolders.map((folder) => getFolderData(folder)),
          ...filteredRequests.map((request) => getRequestData(request)),
        ],
      };
    });
  };

  return (
    <MenuItem onClick={(e) => handleExport(e)}>
      <Typography textAlign='center'>Export Collection</Typography>
    </MenuItem>
  );
}
