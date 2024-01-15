import { Item } from '../../../repository/Item'

export class collectionItem implements Item {
  id: string = ''
  title: string = ''
  parentId: string = ''
  desc: string = ''
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  workspaceId: string = ''
  folders: string[] = []
  requests: string[] = []
}
