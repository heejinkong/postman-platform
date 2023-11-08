import { repositoryItem } from '../../repository/repositoryItem'

export class collectionItem implements repositoryItem {
  id: string = ''
  title: string = ''
  desc: string = ''
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  workspaceId: string = ''
  folders: string[] = []
  requests: string[] = []
}
