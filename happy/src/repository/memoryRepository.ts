import { repository } from './repository'
import { Item } from './Item'
import { v4 as uuidv4 } from 'uuid'

export class memoryRepository implements repository {
  _data: Item[] = []
  data(data: Item[]): memoryRepository {
    this._data = data
    return this
  }

  count(): number {
    return this._data.length
  }
  deleteById(id: string): void {
    const index = this._data.findIndex((_item: Item) => _item.id === id)
    if (index !== -1) {
      this._data.splice(index, 1)
    }
  }
  existsById(id: string): boolean {
    return this._data.findIndex((_item: Item) => _item.id === id) !== -1
  }
  findById(id: string): Item | undefined {
    return this._data.find((_item: Item) => _item.id === id)
  }
  findAll(): Item[] {
    return this._data
  }
  save(item: Item): Item {
    if (this.findById(item.id) !== undefined) {
      // if exist, update item
      const index = this._data.findIndex((_item: Item) => _item.id === item.id)
      if (index !== -1) {
        this._data[index] = item
      }
    } else {
      // if not exists, insert item

      // Gen id
      let id = ''
      try {
        const MAX_TRY = 1000
        for (let i = 0; i < MAX_TRY; i++) {
          const temp = uuidv4()
          if (this.findById(temp) === undefined) {
            id = temp
            break
          }
        }
      } catch {
        /* empty */
      }

      // fail to generate id
      if (id === '') {
        throw new Error('cannot generate id')
      }

      item.id = id
      this._data.push(item)
    }
    return item
  }
}
