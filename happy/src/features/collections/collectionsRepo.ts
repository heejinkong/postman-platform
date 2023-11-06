import { Collection } from "./collection"

export interface CollectionsRepo {
    save(c: Collection): void
    findById(index: number): Collection | undefined
    findAll(): Collection[]
    deleteByCollectionId(id: number): void
    count(): number
}