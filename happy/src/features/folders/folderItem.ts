import { repositoryItem } from '../../repository/repositoryItem'

export class folderItem implements repositoryItem {
  id: string = ''
  title: string = ''
  type: string = 'folder'
  desc: string = ''
  created: number = Date.now()
  updated: number = Date.now()
  authorId: string = ''
  workspaceId: string = ''
  parentId: string = ''
  folders: string[] = []
  requests: string[] = []
}
