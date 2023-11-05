import { Autocomplete, Box, Button, Checkbox, IconButton, TextField } from '@mui/material'
import { useState } from 'react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Tab from '@mui/material/Tab'
import Table from '@mui/joy/Table'
import DeleteIcon from '@mui/icons-material/Delete'

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

export default function RequestsPage() {
  const apiMethod = [
    { label: 'GET', value: 1 },
    { label: 'POST', value: 2 },
    { label: 'PUT', value: 3 },
    { label: 'DELETE', value: 4 }
  ]
  const [value, setValue] = useState('1')

  const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  function createData(Check: boolean, Key: string, Value: number, Description: number) {
    return { Check, Key, Value, Description }
  }

  const rows = [
    createData(true, 'Frozen yoghurt', 159, 6.0),
  ]

  return (
    <Box>
      <Box sx={{ display: 'flex', mb: 5 }}>
        <Box>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={apiMethod}
            sx={{ width: 150 }}
            renderInput={(params) => <TextField {...params} label="Method" />}
          />
        </Box>
        <Box sx={{ flexGrow: 1, ml: 1 }}>
          <TextField
            required
            fullWidth
            id="outlined-required"
            label="Required"
            defaultValue="Hello World"
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          <Button variant="contained" size="large">
            Send
          </Button>
        </Box>
      </Box>
      <Box sx={{ bgcolor: 'background.paper' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Params" value="1" />
              <Tab label="Headers" value="2" />
              <Tab label="Body" value="3" />
              <Tab label="Result" value="4" />
              <Box sx={{display: `flex`, flexDirection: 'row-reverse', alignItems: `flex-end`
          }}>
             <Button variant="contained" size="large" >
               Save
            </Button>
             </Box>
            </TabList>
          </Box>
          <TabPanel value="1">
            <Box>
              <Table sx={{ '& thead th:nth-child(1)': { width: '5%' } }}>
                <thead>
                  <tr>
                    <th> </th>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Description</th>
                    <th> </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.Key}>
                      <td>
                        <Checkbox {...label} defaultChecked />
                      </td>
                      <td>
                        <TextField id="outlined-basic" label="Key" variant="outlined" />
                      </td>
                      <td>
                        <TextField id="outlined-basic" label="Value" variant="outlined" />
                      </td>
                      <td>
                        <TextField id="outlined-basic" label="Description" variant="outlined" />
                      </td>
                      <td>
                        <IconButton aria-label="delete">
                          <DeleteIcon />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          </TabPanel>
          <TabPanel value="2">Headers</TabPanel>
          <TabPanel value="3">Body</TabPanel>
          <TabPanel value="4">
            <Box>
              <TextField
                id="outlined-multiline-static"
                label="Multiline"
                multiline
                fullWidth
                rows={4}
                defaultValue="Default Value"
              />
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  )
}
