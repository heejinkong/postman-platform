import { repositoryItem } from '../../repository/repositoryItem'

export class workspaceItem implements repositoryItem {
  id: string = ''
  title: string = ''
  parentId: string = ''
  desc: string = ''
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  collections: string[] = []
}
