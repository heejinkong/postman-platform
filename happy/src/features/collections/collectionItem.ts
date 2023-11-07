import { repositoryItem } from '../../repository/repositoryItem'

export class collectionItem implements repositoryItem {
  id: string = ''
  title: string = ''
  desc: string = ''
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  parentId: string = ''
  requests: string[] = []
  folders: string[] = []
}
