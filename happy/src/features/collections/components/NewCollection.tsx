import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hook';
import { selectWorkspaceById } from '../../workspaces/service/workspaceSlice';
import { collectionItem } from '../domain/collectionItem';
import collectionService from '../service/collectionService';

export default function NewCollection() {
  const navigate = useNavigate();
  const { workspaceId } = useParams();

  const dispatch = useAppDispatch();
  const workspace = useAppSelector((state) => selectWorkspaceById(state, workspaceId ?? ''));
  if (!workspace) {
    navigate(`/NotFoundPage`);
  }

  const handleNewCollectionClick = () => {
    const newItem = new collectionItem();
    newItem.title = 'New Collection';
    newItem.workspaceId = workspace.id;
    dispatch(collectionService.new(newItem));

    navigate(`/workspaces/${workspace.id}/collections/${newItem.id}`);
  };

  return (
    /* NewCollection 버튼 ('+' 버튼) 클릭 시, 새로운 collection 생성 */
    <IconButton size='small' aria-label='newcollection' onClick={handleNewCollectionClick}>
      <AddIcon />
    </IconButton>
  );
}
