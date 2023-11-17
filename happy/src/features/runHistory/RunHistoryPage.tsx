import {
  Box,
  Container,
  Divider,
  ListItemButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { selectAllRunResults } from '../runTests/service/runTestSlice'
import { useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'

export default function RunHistoryPage() {
  const allRunResults = useSelector(selectAllRunResults)
  // const navigate = useNavigate()

  // const handleTargetClick = () => {
  //   navigate(``)
  // }

  return (
    <Box>
      <Container sx={{ ml: 20 }}>
        <Box sx={{ mt: 2.2 }}>Run History</Box>
        <Box sx={{ mt: 10, ml: 19 }}>
          <Typography variant="h4" gutterBottom>
            Run History
          </Typography>
          <Typography variant="body1" gutterBottom>
            Please click on one item to check its run details.
          </Typography>
        </Box>
        <Box sx={{}}>
          <TableContainer component={Paper} sx={{ mt: 5, width: 900, ml: 18 }}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
              <TableHead>
                <TableRow>
                  <Box sx={{ display: 'flex', ml: 1 }}>
                    <Box>
                      <TableCell>Date/Time</TableCell>
                    </Box>
                    <Box sx={{ ml: 18 }}>
                      <TableCell align="left">Run Target</TableCell>
                    </Box>
                  </Box>
                  <Divider />
                </TableRow>
              </TableHead>
              <TableBody>
                {allRunResults.map((runResult) => (
                  <Box>
                    <ListItemButton key={runResult.id}>
                      {new Date(runResult.created).toLocaleString()}
                      <Box sx={{ ml: 8 }}>{runResult.title}</Box>
                    </ListItemButton>
                    <Divider />
                  </Box>

                  // <TableRow
                  //   key={runResult.id}
                  //   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  // >
                  //   <TableCell component="th" scope="row">
                  //     {new Date(runResult.created).toLocaleString()}
                  //   </TableCell>

                  //   <TableCell align="left">{runResult.title}</TableCell>
                  // </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* <Table sx={{ '& thead th:nth-of-child(1)': { width: '5%' } }}>
            <thead>
              <tr>
                <th> </th>
                <th>Date/Time</th>
                <th>Run Target</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table> */}
        </Box>
        <Box sx={{ mt: 3 }}></Box>
      </Container>
    </Box>
  )
}
// const handleNavRunTest = (requestId: string) => {
//   navigate(`/workspaces/${workspaceId}/requests/${requestId}`)
// }

// if (allRunTests.length === 0) {
//   return (
//     <Container
//       sx={{
//         height: '100%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}
//     >
//       <Box sx={{ width: '100%' }}>
//         <Box sx={{ mt: 20, justifyContent: 'center' }}>
//           <Typography variant="h4" gutterBottom sx={{ ml: 3 }}>
//             Run History does not exist.
//           </Typography>
//           <Typography variant="h6" gutterBottom>
//             You can run all items in the workspace using the button below.
//           </Typography>
//         </Box>
//       </Box>
//     </Container>
//   )
// } else {
// return (
//     <Container
//       sx={{
//         height: '100%',
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center'
//       }}
//     >
//       <List sx={{ width: '100%', maxWidth: 380 }}>
//         {allRunTests.map((runTest) => (
//           <>
//             <ListItemButton key={runTest.id}>
//               <ListItemText
//                 primary={runTest.title}
//                 secondary={new Date(runTest.created).toLocaleString()}
//               />
//               {/* <IconButton edge="end" aria-label="delete" onClick={(e) => handleDeleteClick(e, ws)}>
//     <DeleteIcon />
//   </IconButton> */}
//             </ListItemButton>
//             <Box>
//               <Divider sx={{ my: 0.5 }} />
//             </Box>
//           </>
//         ))}
//       </List>
//       <Divider sx={{ my: 0.5 }} />
//       {/* <Box sx={{ width: '100%' }}>
//         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//           {allRunTests.map((runTest) => (
//             <li key={runTest.id}>{runTest.title}</li>
//           ))}
//         </Box>
//       </Box> */}
//     </Container>
//   )
// }
