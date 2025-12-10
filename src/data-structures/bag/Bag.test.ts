import Bag from './Bag';

import { describe, it, expect, beforeEach } from 'vitest';

describe('Bag', () => {
  describe('constructor', () => {
    it('should create an empty bag when no initial items provided', () => {
      const bag = new Bag<string>();

      expect(bag.size()).toBe(0);
      expect(bag.isEmpty()).toBe(true);
    });

    it('should initialize with items from an array', () => {
      const bag = new Bag(['apple', 'banana', 'apple']);

      expect(bag.size()).toBe(3);
      expect(bag.count('apple')).toBe(2);
      expect(bag.count('banana')).toBe(1);
    });

    it('should initialize with items from a Set', () => {
      const bag = new Bag(new Set(['apple', 'banana']));

      expect(bag.size()).toBe(2);
      expect(bag.count('apple')).toBe(1);
      expect(bag.count('banana')).toBe(1);
    });

    it('should initialize with items from another iterable', () => {
      const bag1 = new Bag(['a', 'a', 'b']);
      const bag2 = new Bag(bag1);

      expect(bag2.size()).toBe(3);
      expect(bag2.count('a')).toBe(2);
      expect(bag2.count('b')).toBe(1);
    });
  });

  describe('add', () => {
    let bag: Bag<string>;

    beforeEach(() => {
      bag = new Bag<string>();
    });

    it('should add a single item to an empty bag', () => {
      bag.add('apple');

      expect(bag.size()).toBe(1);
      expect(bag.count('apple')).toBe(1);
      expect(bag.contains('apple')).toBe(true);
    });

    it('should increment count when adding duplicate items', () => {
      bag.add('apple');
      bag.add('apple');
      bag.add('apple');

      expect(bag.size()).toBe(3);
      expect(bag.count('apple')).toBe(3);
    });

    it('should handle adding different items', () => {
      bag.add('apple');
      bag.add('banana');
      bag.add('cherry');

      expect(bag.size()).toBe(3);
      expect(bag.count('apple')).toBe(1);
      expect(bag.count('banana')).toBe(1);
      expect(bag.count('cherry')).toBe(1);
    });

    it('should work with different types', () => {
      const numBag = new Bag<number>();

      numBag.add(1);
      numBag.add(2);
      numBag.add(1);

      expect(numBag.count(1)).toBe(2);
      expect(numBag.count(2)).toBe(1);
    });
  });

  describe('addMany', () => {
    let bag: Bag<string>;

    beforeEach(() => {
      bag = new Bag<string>();
    });

    it('should add multiple instances of an item at once', () => {
      bag.addMany('apple', 5);

      expect(bag.size()).toBe(5);
      expect(bag.count('apple')).toBe(5);
    });

    it('should add to existing count', () => {
      bag.add('apple');
      bag.add('apple');
      bag.addMany('apple', 3);

      expect(bag.count('apple')).toBe(5);
      expect(bag.size()).toBe(5);
    });

    it('should handle zero amount (no-op)', () => {
      bag.addMany('apple', 0);

      expect(bag.size()).toBe(0);
      expect(bag.count('apple')).toBe(0);
    });

    it('should handle negative amount (no-op)', () => {
      bag.addMany('apple', -5);

      expect(bag.size()).toBe(0);
      expect(bag.count('apple')).toBe(0);
    });

    it('should handle non-integer amount (no-op)', () => {
      bag.addMany('apple', 2.5);

      expect(bag.size()).toBe(0);
      expect(bag.count('apple')).toBe(0);
    });

    it('should work with large amounts', () => {
      bag.addMany('apple', 1000);

      expect(bag.count('apple')).toBe(1000);
      expect(bag.size()).toBe(1000);
    });
  });

  describe('remove', () => {
    let bag: Bag<string>;

    beforeEach(() => {
      bag = new Bag(['apple', 'apple', 'apple', 'banana']);
    });

    it('should remove one instance of an item', () => {
      const result = bag.remove('apple');

      expect(result).toBe(true);
      expect(bag.count('apple')).toBe(2);
      expect(bag.size()).toBe(3);
    });

    it('should return false when removing non-existent item', () => {
      const result = bag.remove('cherry');

      expect(result).toBe(false);

      expect(bag.size()).toBe(4);
    });

    it('should completely remove item when count reaches zero', () => {
      bag.remove('banana');

      expect(bag.contains('banana')).toBe(false);
      expect(bag.count('banana')).toBe(0);
      expect(bag.size()).toBe(3);
    });

    it('should handle multiple removes', () => {
      bag.remove('apple');
      bag.remove('apple');
      bag.remove('apple');

      expect(bag.contains('apple')).toBe(false);
      expect(bag.count('apple')).toBe(0);
      expect(bag.size()).toBe(1);
    });

    it('should return false when removing from already removed item', () => {
      bag.remove('banana');

      const result = bag.remove('banana');

      expect(result).toBe(false);
    });
  });

  describe('contains', () => {
    let bag: Bag<string>;

    beforeEach(() => {
      bag = new Bag(['apple', 'banana']);
    });

    it('should return true for items in the bag', () => {
      expect(bag.contains('apple')).toBe(true);
      expect(bag.contains('banana')).toBe(true);
    });

    it('should return false for items not in the bag', () => {
      expect(bag.contains('cherry')).toBe(false);
    });

    it('should return false after item is completely removed', () => {
      bag.remove('banana');

      expect(bag.contains('banana')).toBe(false);
    });

    it('should return true even if only one instance exists', () => {
      expect(bag.contains('banana')).toBe(true);
    });
  });

  describe('count', () => {
    let bag: Bag<string>;

    beforeEach(() => {
      bag = new Bag(['apple', 'apple', 'banana']);
    });

    it('should return correct count for items', () => {
      expect(bag.count('apple')).toBe(2);
      expect(bag.count('banana')).toBe(1);
    });

    it('should return 0 for non-existent items', () => {
      expect(bag.count('cherry')).toBe(0);
    });

    it('should update count after adding', () => {
      bag.add('banana');

      expect(bag.count('banana')).toBe(2);
    });

    it('should update count after removing', () => {
      bag.remove('apple');

      expect(bag.count('apple')).toBe(1);
    });
  });

  describe('size', () => {
    it('should return 0 for empty bag', () => {
      const bag = new Bag<string>();

      expect(bag.size()).toBe(0);
    });

    it('should return total count including duplicates', () => {
      const bag = new Bag(['a', 'a', 'b', 'c', 'c', 'c']);

      expect(bag.size()).toBe(6);
    });

    it('should update after add operations', () => {
      const bag = new Bag<string>();

      bag.add('a');
      expect(bag.size()).toBe(1);

      bag.add('a');
      expect(bag.size()).toBe(2);

      bag.addMany('b', 5);
      expect(bag.size()).toBe(7);
    });

    it('should update after remove operations', () => {
      const bag = new Bag(['a', 'a', 'b']);

      bag.remove('a');

      expect(bag.size()).toBe(2);
    });
  });

  describe('isEmpty', () => {
    let bag: Bag<string>;

    beforeEach(() => {
      bag = new Bag<string>();
    });

    it('should return true for new empty bag', () => {
      expect(bag.isEmpty()).toBe(true);
    });

    it('should return false after adding items', () => {
      bag.add('apple');

      expect(bag.isEmpty()).toBe(false);
    });

    it('should return true after removing all items', () => {
      bag.add('apple');
      bag.remove('apple');

      expect(bag.isEmpty()).toBe(true);
    });

    it('should return true after clearing', () => {
      bag.add('apple');
      bag.add('banana');
      bag.clear();

      expect(bag.isEmpty()).toBe(true);
    });
  });

  describe('clear', () => {
    let bag: Bag<string>;

    beforeEach(() => {
      bag = new Bag(['apple', 'apple', 'banana', 'cherry']);
    });

    it('should remove all items from the bag', () => {
      bag.clear();

      expect(bag.size()).toBe(0);
      expect(bag.isEmpty()).toBe(true);
    });

    it('should reset all counts', () => {
      bag.clear();

      expect(bag.count('apple')).toBe(0);
      expect(bag.count('banana')).toBe(0);
      expect(bag.count('cherry')).toBe(0);
    });

    it('should allow adding items after clearing', () => {
      bag.clear();
      bag.add('kiwi');

      expect(bag.size()).toBe(1);
      expect(bag.count('kiwi')).toBe(1);
    });

    it('should work on already empty bag', () => {
      const emptyBag = new Bag<string>();

      emptyBag.clear();

      expect(emptyBag.isEmpty()).toBe(true);
    });
  });

  describe('uniqueItems', () => {
    it('should return empty array for empty bag', () => {
      const bag = new Bag<string>();

      expect(bag.uniqueItems()).toEqual([]);
    });

    it('should return all unique items', () => {
      const bag = new Bag(['apple', 'banana', 'apple', 'cherry', 'banana']);

      const unique = bag.uniqueItems();

      expect(unique.length).toBe(3);
      expect(unique).toContain('apple');
      expect(unique).toContain('banana');
      expect(unique).toContain('cherry');
    });

    it('should not include duplicates in result', () => {
      const bag = new Bag(['a', 'a', 'a', 'a']);

      const unique = bag.uniqueItems();

      expect(unique).toEqual(['a']);
    });

    it('should update when items are added', () => {
      const bag = new Bag(['apple']);

      bag.add('banana');
      const unique = bag.uniqueItems();

      expect(unique.length).toBe(2);
    });

    it('should update when items are removed completely', () => {
      const bag = new Bag(['apple', 'banana']);

      bag.remove('banana');
      const unique = bag.uniqueItems();

      expect(unique).toEqual(['apple']);
    });
  });

  describe('iterator', () => {
    it('should iterate over empty bag', () => {
      const bag = new Bag<string>();

      const items = Array.from(bag);

      expect(items).toEqual([]);
    });

    it('should iterate over all items including duplicates', () => {
      const bag = new Bag(['apple', 'banana', 'apple']);

      const items = Array.from(bag);

      expect(items.length).toBe(3);
      expect(items.filter((x) => x === 'apple').length).toBe(2);
      expect(items.filter((x) => x === 'banana').length).toBe(1);
    });

    it('should work with for...of loop', () => {
      const bag = new Bag(['a', 'b', 'a']);

      const collected: string[] = [];
      for (const item of bag) {
        collected.push(item);
      }

      expect(collected.length).toBe(3);
      expect(collected.filter((x) => x === 'a').length).toBe(2);
    });

    it('should work with spread operator', () => {
      const bag = new Bag([1, 2, 2, 3]);
      const items = [...bag];

      expect(items.length).toBe(4);
      expect(items).toContain(1);
      expect(items).toContain(2);
      expect(items).toContain(3);
    });

    it('should iterate correct number of times for each item', () => {
      const bag = new Bag<string>();

      bag.addMany('x', 5);
      bag.addMany('y', 3);
      const items = Array.from(bag);

      expect(items.filter((x) => x === 'x').length).toBe(5);
      expect(items.filter((x) => x === 'y').length).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should handle objects as items', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const bag = new Bag([obj1, obj1, obj2]);

      expect(bag.count(obj1)).toBe(2);
      expect(bag.count(obj2)).toBe(1);
    });

    it('should handle null and undefined', () => {
      const bag = new Bag<string | null | undefined>();

      bag.add(null);
      bag.add(undefined);
      bag.add(null);

      expect(bag.count(null)).toBe(2);
      expect(bag.count(undefined)).toBe(1);
      expect(bag.size()).toBe(3);
    });

    it('should handle very large numbers of items', () => {
      const bag = new Bag<number>();

      bag.addMany(1, 10000);

      expect(bag.count(1)).toBe(10000);
      expect(bag.size()).toBe(10000);
    });

    it('should maintain correct state through complex operations', () => {
      const bag = new Bag(['a', 'b', 'c']);

      bag.add('a');
      bag.addMany('b', 3);
      bag.remove('c');
      bag.add('d');

      expect(bag.count('a')).toBe(2);
      expect(bag.count('b')).toBe(4);
      expect(bag.count('c')).toBe(0);
      expect(bag.count('d')).toBe(1);
      expect(bag.size()).toBe(7);
      expect(bag.uniqueItems().length).toBe(3);
    });
  });
});
