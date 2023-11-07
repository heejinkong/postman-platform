import { repositoryItem } from './repositoryItem'

export interface repository {
  count(): number
  deleteById(id: string): void
  existsById(id: string): boolean
  findById(id: string): repositoryItem | undefined
  findAll(): repositoryItem[]
  save(item: repositoryItem): repositoryItem
}
