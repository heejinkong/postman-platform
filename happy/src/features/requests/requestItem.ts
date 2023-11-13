import { repositoryItem } from '../../repository/repositoryItem'

export class requestItem implements repositoryItem {
  id: string = ''
  title: string = ''
  type: string = 'request'
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  workspaceId: string = ''
  parentId: string = ''
  method: string = ''
  url: string = ''
  params: { paramKey: string; value: string; desc: string; isChecked: boolean }[] = []
  header: { key: string; value: string; desc: string }[] = []
  body: string = ''
  response: {
    statusCode: number
    statusMsg: string
    header: { key: string; value: string; desc: string }[]
    body: string
  } = {
    statusCode: 0,
    statusMsg: '',
    header: [],
    body: ''
  }
}
