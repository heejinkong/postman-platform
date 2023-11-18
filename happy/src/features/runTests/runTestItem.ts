import { repositoryItem } from '../../repository/repositoryItem'

export class runTestItem implements repositoryItem {
  id: string = ''
  title: string = ''
  parentId: string = ''
  requestId: string = ''
  created: number = 0
  duration: number = 0
  status: number = 0
  result: string = ''
  expected: string = ''
}
