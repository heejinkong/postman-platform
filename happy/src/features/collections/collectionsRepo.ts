import { Collection } from "./collection"

export interface CollectionsRepo {
    save(c: Collection): void
    findById(index: number): Collection | undefined
    findAll(): Collection[]
    deleteById(id: number): void
    count(): number
}