import { Item } from './Item'

export interface repository {
  count(): number
  deleteById(id: string): void
  existsById(id: string): boolean
  findById(id: string): Item | undefined
  findAll(): Item[]
  save(item: Item): Item
}
