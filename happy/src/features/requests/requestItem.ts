import { repositoryItem } from '../../repository/repositoryItem'

export class requestItem implements repositoryItem {
  id: string = ''
  title: string = ''
  parentId: string = ''
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  workspaceId: string = ''
  method: string = 'GET'
  url: string = ''
  paramsSelection: number[] = []
  params: { id: number; _key: string; _value: string; _desc: string }[] = [
    { id: 0, _key: '', _value: '', _desc: '' }
  ]
  headersSelection: number[] = []
  headers: { id: number; _key: string; _value: string; _desc: string }[] = [
    { id: 0, _key: '', _value: '', _desc: '' }
  ]
  body: {
    formDataSelection: number[]
    formData: { id: number; _key: string; _value: string; _desc: string }[]
    rawType: string
    rawData: string
  } = {
    formDataSelection: [],
    formData: [{ id: 0, _key: '', _value: '', _desc: '' }],
    rawType: 'Text',
    rawData: ''
  }
  response: {
    status: number
    statusText: string
    headers: { id: number; _key: string; _value: string; _desc: string }[]
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
