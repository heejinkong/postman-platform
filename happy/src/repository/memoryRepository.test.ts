import { memoryRepository } from './memoryRepository';
import { Item } from './Item';

class testItem implements Item {
  id: string = '';
  title: string = '';
  parentId: string = '';
  constructor(title: string) {
    this.title = title;
  }
}

describe('memoryRepository', () => {
  let repo: memoryRepository;

  beforeEach(() => {
    repo = new memoryRepository();
  });

  describe('count', () => {
    it('should return 0 when there are no items in the repository', () => {
      expect(repo.count()).toBe(0);
    });

    it('should return the number of items in the repository', () => {
      repo.save(new testItem('test item 1'));
      repo.save(new testItem('test item 2'));
      expect(repo.count()).toBe(2);
    });
  });

  describe('deleteById', () => {
    it('should not throw an error when the item does not exist', () => {
      expect(() => repo.deleteById('1')).not.toThrow();
    });

    it('should remove the item from the repository', () => {
      const item: Item = new testItem('test item 1');
      repo.save(item);
      repo.deleteById(item.id);
      expect(repo.findById(item.id)).toBeUndefined();
    });
  });

  describe('existsById', () => {
    it('should return false when the item does not exist', () => {
      expect(repo.existsById('1')).toBe(false);
    });

    it('should return true when the item exists', () => {
      const item: Item = new testItem('test item 1');
      repo.save(item);
      expect(repo.existsById(item.id)).toBe(true);
    });
  });

  describe('findById', () => {
    it('should return undefined when the item does not exist', () => {
      expect(repo.findById('1')).toBeUndefined();
    });

    it('should return the item when it exists', () => {
      const item: Item = new testItem('test item 1');
      repo.save(item);
      expect(repo.findById(item.id)).toEqual(item);
    });
  });

  describe('findAll', () => {
    it('should return an empty array when there are no items in the repository', () => {
      expect(repo.findAll()).toEqual([]);
    });

    it('should return all items in the repository', () => {
      const item1: Item = new testItem('test item 1');
      const item2: Item = new testItem('test item 2');
      repo.save(item1);
      repo.save(item2);
      expect(repo.findAll()).toEqual([item1, item2]);
    });
  });

  describe('save', () => {
    it('should add the item to the repository', () => {
      const item: Item = new testItem('test item 1');
      repo.save(item);
      expect(repo.findById(item.id)).toEqual(item);
    });

    it('should update the item in the repository if it already exists', () => {
      const item: Item = new testItem('test item 1');
      repo.save(item);
      const updatedItem: Item = Object.assign({}, item, { name: 'Item 2' });
      repo.save(updatedItem);
      expect(repo.findById(item.id)).toEqual(updatedItem);
    });
  });
});
