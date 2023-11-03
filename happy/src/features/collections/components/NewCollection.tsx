import { Box, IconButton } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { useNavigate, useParams } from 'react-router-dom'

export default function NewCollection() {
  const navigate = useNavigate()
  const { workspaceId } = useParams()

  const handleNewCollectionClick = () => {
    navigate(`/workspaces/${workspaceId}/collections/:Id`)
    console.log(workspaceId)
    if (workspaceId === undefined) {
      alert('workspace를 선택해주세요')
      navigate(`/`)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row-reverse', mt: 2 }}>
      <IconButton aria-label="newcollection" onClick={handleNewCollectionClick}>
        <AddIcon />
      </IconButton>
    </Box>
  )
}
