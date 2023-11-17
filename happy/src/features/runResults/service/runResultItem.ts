import { repositoryItem } from '../../../repository/repositoryItem'

export class runResultItem implements repositoryItem {
  id: string = ''
  title: string = ''
  parentId: string = ''
  created: number = 0
  Iteration: number = 0
  Duration: number = 0
  runTestList: string[] = []
}
