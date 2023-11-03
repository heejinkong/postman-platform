import { expect, test } from '@jest/globals'
import { MemoryWorkspacesRepo } from './memoryRepo'
import { WORKSPACE_DEFAULT, Workspace } from './workspace'

describe('MemoryWorkspacesRepo', () => {
  let repo: MemoryWorkspacesRepo

  beforeEach(() => {
    repo = new MemoryWorkspacesRepo()
    repo._data = {
      sequence: 1,
      Workspaces: [WORKSPACE_DEFAULT]
    }
  })

  afterEach(() => {})

  test('save', () => {
    repo.save(WORKSPACE_DEFAULT)
    expect(repo._data.Workspaces.length).toBe(2)
  })

  test('findById', () => {
    const workspace = repo.findById(1)
    expect(workspace?.id ?? -1).toEqual(1)
  })

  test('findAll', () => {
    const workspaces = repo.findAll()
    expect(workspaces.length).toEqual(1)
  })

  test('deleteById', () => {
    repo.deleteById(1)
    expect(repo._data.Workspaces.length).toBe(0)
  })

  test('count', () => {
    expect(repo.count()).toBe(1)
  })

  test('update', () => {
    let target = repo._data.Workspaces.find((ws) => ws.id === 1)
    expect(target?.title ?? '').toBe('')

    const newWs: Workspace = {
      id: 1,
      title: 'HAHAHA',
      desc: 'HAHAHA',
      created: 0,
      updated: 0,
      author: 'admin',
      author_id: 0,
      collections: []
    }
    repo.update(newWs)

    target = repo._data.Workspaces.find((ws) => ws.id === 1)

    expect(target?.title ?? '').toBe('HAHAHA')
  })
})
