import { Item as Item } from '../../../repository/Item'
import { v4 as uuidv4 } from 'uuid'

export class requestItem implements Item {
  id: string = ''
  title: string = ''
  parentId: string = ''
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  workspaceId: string = ''
  method: string = 'GET'
  url: string = ''
  paramsSelection: string[] = []
  params: { id: string; _key: string; _value: string; _desc: string }[] = [
    { id: uuidv4(), _key: '', _value: '', _desc: '' }
  ]
  headersSelection: string[] = []
  headers: { id: string; _key: string; _value: string; _desc: string }[] = [
    { id: uuidv4(), _key: '', _value: '', _desc: '' }
  ]
  body: {
    formDataSelection: string[]
    formData: { id: string; _key: string; _dataType: string; _value: string[]; _desc: string }[]
    rawType: string
    rawData: string
    mode: string
  } = {
    formDataSelection: [],
    formData: [{ id: uuidv4(), _key: '', _dataType: 'Text', _value: [], _desc: '' }],
    rawType: 'Text',
    rawData: '',
    mode: 'formdata'
  }

  response: {
    status: number
    statusText: string
    headers: { id: string; _key: string; _value: string; _desc: string }[]
    body: string
    elapsed: number
  } = {
    status: 0,
    statusText: '',
    headers: [],
    body: '',
    elapsed: 0
  }
  expectedResult: string = ''
}

export interface requestCommands {
  new: unknown
  delete: unknown
  update: unknown
  send: unknown
}
