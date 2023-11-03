import { expect, test } from '@jest/globals'
import { MemoryCollectionsRepo } from './memoryRepo'
import { COLLECTION_DEFAULT } from './collection'

describe('MemoryCollectionsRepo', () => {
  let repo: MemoryCollectionsRepo

  beforeEach(() => {
    repo = new MemoryCollectionsRepo()
    repo._data = {
      sequence: 1,
      Collections: [COLLECTION_DEFAULT]
    }
  })

  afterEach(() => {})

  test('save', () => {
    repo.save(COLLECTION_DEFAULT)
    expect(repo._data.Collections.length).toBe(2)
  })

})
