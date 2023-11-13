import { Box, Checkbox, IconButton, Table, TextField } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'

type requestParamsProps = {
  paramKey: string
  setKey: (key: string) => void
  value: string
  setValue: (value: string) => void
  description: string
  setDescription: (description: string) => void
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

export default function AddParamsItem(props: requestParamsProps) {
  // key, value, description에 값을 입력하면 rows에 추가되는 기능 구현

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
          {/* {rows.map((row) => ( */}
          {/* <tr key={row.Key}> */}
          <tr>
            <td>
              <Checkbox {...label} defaultChecked />
            </td>
            <td>
              <TextField
                id="key"
                label="key"
                variant="outlined"
                onChange={(e) => {
                  props.setKey(e.target.value)
                }}
                value={props.paramKey}
              />
            </td>
            <td>
              <TextField
                id="value"
                label="value"
                variant="outlined"
                onChange={(e) => {
                  props.setValue(e.target.value)
                }}
                value={props.value}
              />
            </td>
            <td>
              <TextField
                id="description"
                label="Description"
                variant="outlined"
                onChange={(e) => {
                  props.setDescription(e.target.value)
                }}
                value={props.description}
              />
            </td>
            <td>
              <IconButton aria-label="delete">
                <DeleteIcon />
              </IconButton>
            </td>
          </tr>
          {/* ))} */}
        </tbody>
      </Table>
    </Box>
  )
}
