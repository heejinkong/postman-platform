import { Item } from '../../../repository/Item'

export class runResultItem implements Item {
  id: string = ''
  title: string = ''
  workspaceId: string = ''
  parentId: string = ''
  method: string = ''
  url: string = ''
  created: number = Date.now()
  Iteration: number = 0
  Duration: number = 0
  runTestList: string[] = []
}
