import { Box, Button, Container, Divider, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hook';
import { selectCollectionById } from './service/collectionSlice';
import { useNavigate, useParams } from 'react-router-dom';
import collectionService from './service/collectionService';
import configService from '../config/service/configService';
import WorkspaceNavBar from '../workspaces/components/WorkspaceNavBar';
import { styled } from '@mui/system';
import SaveIcon from '@mui/icons-material/Save';
import SlideshowIcon from '@mui/icons-material/Slideshow';
import { selectAllFolders } from '../folders/service/folderSlice';
import { selectAllRequests } from '../requests/service/requestSlice';
import { requestItem } from '../requests/domain/requestItem';
import { runResultItem } from '../runResults/domain/runResultItem';
import requestService from '../requests/service/requestService';
import { runTestItem } from '../runTests/domain/runTestItem';
import runTestService from '../runTests/service/runTestService';
import runResultService from '../runResults/service/runResultService';

interface ResponseType {
  elapsed?: number;
  body?: string;
  status?: number;
}
interface PayloadType {
  url: string;
  method: string;
  response?: ResponseType;
  title?: string;
  expectedResult?: string;
}

export default function CollectionPage() {
  const navigate = useNavigate();
  const { collectionId } = useParams();

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const dispatch = useAppDispatch();
  const collection = useAppSelector((state) => selectCollectionById(state, collectionId ?? ''));
  if (!collection) {
    navigate(`/NotFoundPage`);
  }

  const handleUpdateClick = () => {
    const cloned = JSON.parse(JSON.stringify(collection));
    cloned.title = title;
    cloned.desc = desc;
    dispatch(collectionService.update(cloned));
  };

  useEffect(() => {
    setTitle(collection.title);
    setDesc(collection.desc);
    dispatch(configService.navItemOpened(collection));
  }, [collection, dispatch]);

  const folderInCollection = useAppSelector(selectAllFolders).filter((folder) => {
    return folder.parentId === collectionId;
  });
  const folders = useAppSelector(selectAllFolders) ?? [];
  const requests = useAppSelector(selectAllRequests) ?? [];

  const requestList: requestItem[] = [];

  const dfs = (folderId: string) => {
    const requestInFolder = requests.filter((request) => request.parentId === folderId);
    requestList.push(...requestInFolder);

    const subFolder = folders.filter((folder) => folder.parentId === folderId);
    if (subFolder.length > 0) {
      subFolder.forEach((folder) => {
        dfs(folder.id);
      });
    }
  };

  const handleRunClick = () => {
    const newRunResult = new runResultItem();
    newRunResult.title = collection.title;
    newRunResult.workspaceId = collection.workspaceId;
    newRunResult.parentId = collection?.id ?? '';
    newRunResult.created = Date.now();

    folderInCollection.forEach((folder) => {
      dfs(folder.id);
    });

    requests.forEach((request) => {
      if (request.parentId === collectionId) {
        requestList.push(request);
      }
    });

    async function processRequests() {
      let runNum = 0;

      for (const request of requestList) {
        const response = await dispatch(requestService.send({ request: request, formFiles: [] }));
        const resBody = (response.payload as PayloadType)?.response?.body;
        const resTitle = (response.payload as PayloadType)?.title;
        const resStatus = (response.payload as PayloadType)?.response?.status;
        const resExpectedResult = (response.payload as PayloadType)?.expectedResult;

        const newRunTest = new runTestItem();
        newRunTest.title = resTitle || '';
        newRunTest.parentId = collection?.id ?? '';
        newRunTest.requestId = request.id;
        newRunTest.created = Date.now();
        newRunTest.status = resStatus || 0;
        newRunTest.responseResult = resBody || '';
        newRunTest.expectedResult = resExpectedResult || '';
        dispatch(runTestService.new(newRunTest));
        newRunResult.runTestList?.push(newRunTest.id);

        if ((resStatus === 200 || resStatus === 201) && (resExpectedResult === '' || resExpectedResult === resBody)) {
          runNum++;
        } else {
          runNum--;
        }
      }

      if (runNum === requestList.length) {
        newRunResult.runResult = 1;
      } else {
        newRunResult.runResult = -1;
      }

      dispatch(runResultService.new(newRunResult));

      navigate(`/workspaces/${collection.workspaceId}/runHistory`);
    }

    processRequests();
  };

  const NavBarBox = styled(Box)({
    '&.NavBarBox': {
      padding: '12px 16px 0 16px',
      '& nav': {
        height: '22px',
      },
      '& a': {
        fontSize: '14px',
      },
      '& > .NavBarBoxDivider': {
        marginTop: '12px',
      },
    },
  });

  return (
    /* CollectionPage에서는 해당 collection의 title과 description을 수정하는 페이지 */
    <Box>
      {/* CollectionPage의 상단에는 WorkspaceNavBar를 통해 현재 path 표시 */}
      <NavBarBox className='NavBarBox'>
        <WorkspaceNavBar _id={collectionId ?? ''} />
        <Box className='NavBarBoxDivider'>
          <Divider />
        </Box>
      </NavBarBox>
      <Container sx={{ padding: '0 16px', maxWidth: '100%' }}>
        {/* 수정한 title과 description을 update하는 버튼 */}
        <Box sx={{ padding: '12px 0', display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            className='btnWhite'
            variant='contained'
            size='small'
            onClick={handleRunClick}
            sx={{ marginRight: '12px' }}
            startIcon={<SlideshowIcon />}
          >
            Run Collection
          </Button>
          <Button
            className='btnWhite'
            variant='contained'
            size='small'
            onClick={handleUpdateClick}
            sx={{ marginRight: '12px' }}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: '54px' }}>
          <Box
            sx={{
              maxWidth: '868px',
              width: '100%',
            }}
          >
            {/* CollectionPage의 title을 수정할 수 있는 TextField */}
            <Box sx={{ mt: 3 }}>
              <TextField
                required
                fullWidth
                id='outlined-required'
                label='Collection Name'
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                value={title}
              />
            </Box>
            {/* CollectionPage의 description을 수정할 수 있는 TextField */}
            <Box
              sx={{
                mt: 3,
                '& .MuiInputBase-root': {
                  padding: 0,
                },
              }}
            >
              <TextField
                fullWidth
                id='outlined-multiline-static'
                label='Description'
                multiline
                rows={15}
                value={desc}
                sx={{
                  mb: '16px',
                  width: '100%',
                  '& .MuiInputBase-input': {
                    padding: '16px 14px',
                  },
                }}
                onChange={(e) => setDesc(e.target.value)}
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
