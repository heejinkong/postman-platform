import { CollectionsRepo } from "./collectionsRepo";
import { Collection } from "./collection";

export class MemoryCollectionsRepo implements CollectionsRepo {

  _data: {
    sequence: number
  Collections: Collection[]
  } = { sequence: 0, Collections: [] }
    addCollectionToWorkspace: any;

  //data 
  data(d: { sequence: number; Collections: Collection[] }): MemoryCollectionsRepo {
    this._data = d
    return this
  }

  save(c: Collection): void {
    c.id = this._data.sequence++
    this._data.Collections.push(c)
  }
  findById(id: number): Collection | undefined {
    return this._data.Collections.find((c) => c.id === id)
  }
  findAll(): Collection[] {
    return this._data.Collections
  }
  deleteById(id: number): void {
    this._data.Collections = this._data.Collections.filter((c) => c.id !== id)
  }
  count(): number {
    return this._data.Collections.length
  }
  update(c: Collection) {
    console.log(this._data.Collections)
    const index = this._data.Collections.findIndex((_c) => _c.id === c.id)
    console.log(index)
    if (index === -1) {
      return
    }
    this._data.Collections[index] = c
    console.log(this._data.Collections)
  }
}