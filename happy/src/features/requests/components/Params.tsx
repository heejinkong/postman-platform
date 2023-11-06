import { Box, Checkbox, IconButton, Table, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

export default function Params() {
  const [key, setKey] = useState('')
  const [value, setValue] = useState('')
  const [description, setDescription] = useState('')

  const rows = [createData(true, 'Frozen yoghurt', 159, 6.0)]

  function createData(Check: boolean, Key: string, Value: number, Description: number) {
    return { Check, Key, Value, Description }
  }
  return (
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
                <TextField
                  id="key"
                  label="Key"
                  variant="outlined"
                  onChange={(e) => {
                    setKey(e.target.value)
                  }}
                  value={key}
                />
              </td>
              <td>
                <TextField
                  id="value"
                  label="Value"
                  variant="outlined"
                  onChange={(e) => {
                    setValue(e.target.value)
                  }}
                  value={value}
                />
              </td>
              <td>
                <TextField
                  id="description"
                  label="Description"
                  variant="outlined"
                  onChange={(e) => {
                    setDescription(e.target.value)
                  }}
                  value={description}
                />
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
  )
}
