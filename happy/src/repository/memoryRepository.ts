import { repository } from './repository'
import { repositoryItem } from './repositoryItem'

export class memoryRepository implements repository {
  _data: repositoryItem[] = []
  data(data: repositoryItem[]): memoryRepository {
    this._data = data
    return this
  }

  count(): number {
    return this._data.length
  }
  deleteById(id: string): void {
    const index = this._data.findIndex((_item: repositoryItem) => _item.id === id)
    if (index !== -1) {
      this._data.splice(index, 1)
    }
  }
  existsById(id: string): boolean {
    return this._data.findIndex((_item: repositoryItem) => _item.id === id) !== -1
  }
  findById(id: string): repositoryItem | undefined {
    return this._data.find((_item: repositoryItem) => _item.id === id)
  }
  findAll(): repositoryItem[] {
    return this._data
  }
  save(item: repositoryItem): repositoryItem {
    if (this.findById(item.id) !== undefined) {
      // if not exists, insert item
      const index = this._data.findIndex((_item: repositoryItem) => _item.id === item.id)
      if (index !== -1) {
        this._data[index] = item
      }
    } else {
      // if exist, update item
      let uuid = ''
      do {
        uuid = crypto.randomUUID()
      } while (this.findById(uuid) !== undefined)

      item.id = uuid
      this._data.push(item)
    }
    return item
  }
}
