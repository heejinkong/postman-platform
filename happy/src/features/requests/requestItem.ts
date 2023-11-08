import { repositoryItem } from '../../repository/repositoryItem'

export class requestItem implements repositoryItem {
  id: string = ''
  title: string = ''
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  workspaceId: string = ''
  parentId: string = ''
  method: string = ''
  url: string = ''
  params: { key: string; value: string; desc: string }[] = []
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
