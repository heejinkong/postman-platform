import { Item } from '../../../repository/Item'

export class runTestItem implements Item {
  id: string = ''
  title: string = ''
  parentId: string = ''
  requestId: string = ''
  created: number = 0
  duration: number = 0
  status: number = 0
  responseResult: string = ''
  expectedResult: string = ''
}
