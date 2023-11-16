import { Box, Container, Typography } from '@mui/material'
import RunTestPage from '../runTests/RunTestPage'

export default function RunHistoryPage() {
  return <Box></Box>
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
