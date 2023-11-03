import { Workspace } from "./workspace"

export interface WorkspacesRepo {
  save(ws: Workspace): void
  findById(index: number): Workspace | undefined
  findAll(): Workspace[]
  deleteById(id: number): void
  count(): number
}
