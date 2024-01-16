import { Item } from '../../../repository/Item'

export class workspaceItem implements Item {
  id: string = ''
  title: string = ''
  parentId: string = ''
  desc: string = ''
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  collections: string[] = []
  globalsId: string[] = []
}
