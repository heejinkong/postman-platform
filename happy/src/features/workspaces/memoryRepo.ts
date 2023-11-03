import { Workspace } from './workspace'
import { WorkspacesRepo } from './workspacesRepo'

export class MemoryWorkspacesRepo implements WorkspacesRepo {
  _data: {
    sequence: number
    Workspaces: Workspace[]
  } = { sequence: 0, Workspaces: [] }

  data(d: { sequence: number; Workspaces: Workspace[] }): MemoryWorkspacesRepo {
    this._data = d
    return this
  }

  save(ws: Workspace): void {
    ws.id = this._data.sequence++
    this._data.Workspaces.push(ws)
  }
  findById(id: number): Workspace | undefined {
    return this._data.Workspaces.find((ws) => ws.id === id)
  }
  findAll(): Workspace[] {
    return this._data.Workspaces
  }
  deleteById(id: number): void {
    this._data.Workspaces = this._data.Workspaces.filter((ws) => ws.id !== id)
  }
  count(): number {
    return this._data.Workspaces.length
  }
  update(ws: Workspace) {
    console.log(this._data.Workspaces)
    const index = this._data.Workspaces.findIndex((_ws) => _ws.id === ws.id)
    console.log(index)
    if (index === -1) {
      return
    }
    this._data.Workspaces[index] = ws
    console.log(this._data.Workspaces)
  }
}
