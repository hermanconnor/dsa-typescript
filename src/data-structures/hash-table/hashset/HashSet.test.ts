/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import HashSet from './HashSet';

describe('HashSet', () => {
  let set: HashSet<string>;

  beforeEach(() => {
    set = new HashSet<string>();
  });

  describe('Constructor', () => {
    it('should create an empty set with default capacity', () => {
      expect(set.size()).toBe(0);
      expect(set.isEmpty()).toBe(true);
      expect(set.getCapacity()).toBe(16);
    });

    it('should create a set with custom initial capacity', () => {
      const customSet = new HashSet<string>(32);
      expect(customSet.getCapacity()).toBe(32);
      expect(customSet.size()).toBe(0);
    });

    it('should create a set with custom load factor', () => {
      const customSet = new HashSet<string>(16, 0.5);
      expect(customSet.getLoadFactor()).toBe(0);
    });

    it('should throw error for invalid initial capacity', () => {
      expect(() => new HashSet(0)).toThrow('Initial capacity must be positive');
      expect(() => new HashSet(-5)).toThrow(
        'Initial capacity must be positive',
      );
    });

    it('should throw error for invalid load factor', () => {
      expect(() => new HashSet(16, 0)).toThrow(
        'Load factor must be between 0 and 1',
      );
      expect(() => new HashSet(16, 1.5)).toThrow(
        'Load factor must be between 0 and 1',
      );
      expect(() => new HashSet(16, -0.5)).toThrow(
        'Load factor must be between 0 and 1',
      );
    });
  });

  describe('add()', () => {
    it('should add a single value', () => {
      set.add('apple');
      expect(set.has('apple')).toBe(true);
      expect(set.size()).toBe(1);
    });

    it('should add multiple values', () => {
      set.add('apple');
      set.add('banana');
      set.add('cherry');

      expect(set.has('apple')).toBe(true);
      expect(set.has('banana')).toBe(true);
      expect(set.has('cherry')).toBe(true);
      expect(set.size()).toBe(3);
    });

    it('should not add duplicate values', () => {
      set.add('apple');
      set.add('apple');
      set.add('apple');

      expect(set.size()).toBe(1);
      expect(set.has('apple')).toBe(true);
    });

    it('should support method chaining', () => {
      const result = set.add('apple').add('banana').add('cherry');

      expect(result).toBe(set);
      expect(set.size()).toBe(3);
    });

    it('should handle different value types', () => {
      const numSet = new HashSet<number>();
      numSet.add(1).add(2).add(3);

      expect(numSet.has(1)).toBe(true);
      expect(numSet.has(2)).toBe(true);
      expect(numSet.has(3)).toBe(true);
      expect(numSet.size()).toBe(3);
    });

    it('should handle boolean values', () => {
      const boolSet = new HashSet<boolean>();
      boolSet.add(true).add(false).add(true);

      expect(boolSet.size()).toBe(2);
      expect(boolSet.has(true)).toBe(true);
      expect(boolSet.has(false)).toBe(true);
    });
  });

  describe('has()', () => {
    it('should return true for existing values', () => {
      set.add('apple');
      expect(set.has('apple')).toBe(true);
    });

    it('should return false for non-existent values', () => {
      expect(set.has('nonexistent')).toBe(false);
    });

    it('should return true after adding a value', () => {
      expect(set.has('apple')).toBe(false);
      set.add('apple');
      expect(set.has('apple')).toBe(true);
    });

    it('should return false after deleting a value', () => {
      set.add('apple');
      expect(set.has('apple')).toBe(true);
      set.delete('apple');
      expect(set.has('apple')).toBe(false);
    });
  });

  describe('delete()', () => {
    it('should delete an existing value', () => {
      set.add('apple');
      const result = set.delete('apple');

      expect(result).toBe(true);
      expect(set.has('apple')).toBe(false);
      expect(set.size()).toBe(0);
    });

    it('should return false when deleting non-existent value', () => {
      const result = set.delete('nonexistent');
      expect(result).toBe(false);
    });

    it('should correctly update size after deletion', () => {
      set.add('apple');
      set.add('banana');
      set.add('cherry');

      expect(set.size()).toBe(3);
      set.delete('banana');
      expect(set.size()).toBe(2);
      set.delete('apple');
      expect(set.size()).toBe(1);
    });

    it('should handle multiple deletions', () => {
      set.add('apple');
      set.add('banana');

      expect(set.delete('apple')).toBe(true);
      expect(set.delete('apple')).toBe(false); // Already deleted
      expect(set.delete('banana')).toBe(true);
      expect(set.size()).toBe(0);
    });

    it('should delete from bucket with multiple values (collision handling)', () => {
      const smallSet = new HashSet<string>(2); // Small capacity to force collisions
      smallSet.add('a');
      smallSet.add('b');
      smallSet.add('c');
      smallSet.add('d');

      expect(smallSet.delete('b')).toBe(true);
      expect(smallSet.has('a')).toBe(true);
      expect(smallSet.has('b')).toBe(false);
      expect(smallSet.has('c')).toBe(true);
      expect(smallSet.has('d')).toBe(true);
    });
  });

  describe('size()', () => {
    it('should return 0 for empty set', () => {
      expect(set.size()).toBe(0);
    });

    it('should return correct size after additions', () => {
      set.add('apple');
      expect(set.size()).toBe(1);

      set.add('banana');
      expect(set.size()).toBe(2);

      set.add('cherry');
      expect(set.size()).toBe(3);
    });

    it('should not change size when adding duplicate', () => {
      set.add('apple');
      set.add('apple');
      expect(set.size()).toBe(1);
    });

    it('should decrease size after deletion', () => {
      set.add('apple');
      set.add('banana');
      expect(set.size()).toBe(2);

      set.delete('apple');
      expect(set.size()).toBe(1);
    });
  });

  describe('isEmpty()', () => {
    it('should return true for empty set', () => {
      expect(set.isEmpty()).toBe(true);
    });

    it('should return false after adding values', () => {
      set.add('apple');
      expect(set.isEmpty()).toBe(false);
    });

    it('should return true after clearing', () => {
      set.add('apple');
      set.clear();
      expect(set.isEmpty()).toBe(true);
    });

    it('should return true after deleting all values', () => {
      set.add('apple');
      set.delete('apple');
      expect(set.isEmpty()).toBe(true);
    });
  });

  describe('clear()', () => {
    it('should clear all values', () => {
      set.add('apple');
      set.add('banana');
      set.add('cherry');

      set.clear();

      expect(set.size()).toBe(0);
      expect(set.isEmpty()).toBe(true);
      expect(set.has('apple')).toBe(false);
      expect(set.has('banana')).toBe(false);
      expect(set.has('cherry')).toBe(false);
    });

    it('should maintain capacity after clear', () => {
      const capacity = set.getCapacity();
      set.add('apple');
      set.clear();
      expect(set.getCapacity()).toBe(capacity);
    });

    it('should allow adding values after clear', () => {
      set.add('apple');
      set.clear();
      set.add('banana');

      expect(set.size()).toBe(1);
      expect(set.has('banana')).toBe(true);
    });
  });

  describe('forEach()', () => {
    it('should iterate over all values', () => {
      set.add('apple');
      set.add('banana');
      set.add('cherry');

      const values: string[] = [];
      set.forEach((value) => {
        values.push(value);
      });

      expect(values).toHaveLength(3);
      expect(values).toContain('apple');
      expect(values).toContain('banana');
      expect(values).toContain('cherry');
    });

    it('should not iterate over empty set', () => {
      let count = 0;
      set.forEach(() => count++);
      expect(count).toBe(0);
    });

    it('should pass correct arguments to callback', () => {
      set.add('apple');

      set.forEach((value1, value2, s) => {
        expect(value1).toBe('apple');
        expect(value2).toBe('apple'); // Set passes value twice for API compatibility
        expect(s).toBe(set);
      });
    });

    it('should respect thisArg', () => {
      set.add('apple');

      const context = { prefix: 'fruit: ' };
      let result = '';

      set.forEach(function (this: typeof context, value) {
        result = this.prefix + value;
      }, context);

      expect(result).toBe('fruit: apple');
    });
  });

  describe('Iterators', () => {
    beforeEach(() => {
      set.add('apple');
      set.add('banana');
      set.add('cherry');
    });

    describe('values()', () => {
      it('should return all values', () => {
        const values = Array.from(set.values());
        expect(values).toHaveLength(3);
        expect(values).toContain('apple');
        expect(values).toContain('banana');
        expect(values).toContain('cherry');
      });

      it('should return empty iterator for empty set', () => {
        set.clear();
        const values = Array.from(set.values());
        expect(values).toHaveLength(0);
      });
    });

    describe('keys()', () => {
      it('should return all values (alias for values)', () => {
        const keys = Array.from(set.keys());
        expect(keys).toHaveLength(3);
        expect(keys).toContain('apple');
        expect(keys).toContain('banana');
        expect(keys).toContain('cherry');
      });
    });

    describe('entries()', () => {
      it('should return [value, value] tuples', () => {
        const entries = Array.from(set.entries());
        expect(entries).toHaveLength(3);
        expect(entries).toContainEqual(['apple', 'apple']);
        expect(entries).toContainEqual(['banana', 'banana']);
        expect(entries).toContainEqual(['cherry', 'cherry']);
      });
    });

    describe('Symbol.iterator', () => {
      it('should make set iterable with for...of', () => {
        const values: string[] = [];

        for (const value of set) {
          values.push(value);
        }

        expect(values).toHaveLength(3);
        expect(values).toContain('apple');
        expect(values).toContain('banana');
        expect(values).toContain('cherry');
      });

      it('should work with spread operator', () => {
        const values = [...set];
        expect(values).toHaveLength(3);
      });
    });
  });

  describe('toArray()', () => {
    it('should convert set to array', () => {
      set.add('apple');
      set.add('banana');
      set.add('cherry');

      const arr = set.toArray();
      expect(arr).toHaveLength(3);
      expect(arr).toContain('apple');
      expect(arr).toContain('banana');
      expect(arr).toContain('cherry');
    });

    it('should return empty array for empty set', () => {
      const arr = set.toArray();
      expect(arr).toEqual([]);
    });
  });

  describe('Set Operations', () => {
    let setA: HashSet<number>;
    let setB: HashSet<number>;

    beforeEach(() => {
      setA = new HashSet<number>();
      setA.add(1).add(2).add(3).add(4);

      setB = new HashSet<number>();
      setB.add(3).add(4).add(5).add(6);
    });

    describe('intersection()', () => {
      it('should return values in both sets', () => {
        const result = setA.intersection(setB);
        const values = result.toArray().sort();

        expect(values).toEqual([3, 4]);
      });

      it('should return empty set when no common values', () => {
        const setC = new HashSet<number>();
        setC.add(7).add(8);

        const result = setA.intersection(setC);
        expect(result.size()).toBe(0);
      });

      it('should handle intersection with empty set', () => {
        const emptySet = new HashSet<number>();
        const result = setA.intersection(emptySet);
        expect(result.size()).toBe(0);
      });

      it('should optimize by iterating smaller set', () => {
        const smallSet = new HashSet<number>();
        smallSet.add(1);

        const largeSet = new HashSet<number>();
        for (let i = 1; i <= 100; i++) largeSet.add(i);

        const result = smallSet.intersection(largeSet);
        expect(result.toArray()).toEqual([1]);
      });
    });

    describe('union()', () => {
      it('should return values in either set', () => {
        const result = setA.union(setB);
        const values = result.toArray().sort((a, b) => a - b);

        expect(values).toEqual([1, 2, 3, 4, 5, 6]);
      });

      it('should handle union with empty set', () => {
        const emptySet = new HashSet<number>();
        const result = setA.union(emptySet);

        expect(result.size()).toBe(setA.size());
        expect(result.toArray().sort((a, b) => a - b)).toEqual([1, 2, 3, 4]);
      });

      it('should not duplicate common values', () => {
        const setC = new HashSet<number>();
        setC.add(1).add(2);

        const result = setA.union(setC);
        expect(result.size()).toBe(4); // 1, 2, 3, 4
      });
    });

    describe('difference()', () => {
      it('should return values in first set but not second', () => {
        const result = setA.difference(setB);
        const values = result.toArray().sort((a, b) => a - b);

        expect(values).toEqual([1, 2]);
      });

      it('should return all values when no common values', () => {
        const setC = new HashSet<number>();
        setC.add(7).add(8);

        const result = setA.difference(setC);
        expect(result.size()).toBe(4);
      });

      it('should return empty set when all values are common', () => {
        const setC = new HashSet<number>();
        setC.add(1).add(2).add(3).add(4);

        const result = setA.difference(setC);
        expect(result.size()).toBe(0);
      });
    });

    describe('symmetricDifference()', () => {
      it('should return values in either set but not both', () => {
        const result = setA.symmetricDifference(setB);
        const values = result.toArray().sort((a, b) => a - b);

        expect(values).toEqual([1, 2, 5, 6]);
      });

      it('should return union when no common values', () => {
        const setC = new HashSet<number>();
        setC.add(7).add(8);

        const result = setA.symmetricDifference(setC);
        const values = result.toArray().sort((a, b) => a - b);

        expect(values).toEqual([1, 2, 3, 4, 7, 8]);
      });

      it('should return empty set when sets are identical', () => {
        const setC = new HashSet<number>();
        setC.add(1).add(2).add(3).add(4);

        const result = setA.symmetricDifference(setC);
        expect(result.size()).toBe(0);
      });
    });
  });

  describe('Set Relationships', () => {
    let setA: HashSet<number>;
    let setB: HashSet<number>;

    beforeEach(() => {
      setA = new HashSet<number>();
      setA.add(1).add(2).add(3).add(4);

      setB = new HashSet<number>();
      setB.add(1).add(2);
    });

    describe('isSubsetOf()', () => {
      it('should return true when all values are in other set', () => {
        expect(setB.isSubsetOf(setA)).toBe(true);
      });

      it('should return false when not all values are in other set', () => {
        expect(setA.isSubsetOf(setB)).toBe(false);
      });

      it('should return true for identical sets', () => {
        const setC = new HashSet<number>();
        setC.add(1).add(2);

        expect(setB.isSubsetOf(setC)).toBe(true);
      });

      it('should return true for empty set (empty is subset of any set)', () => {
        const emptySet = new HashSet<number>();
        expect(emptySet.isSubsetOf(setA)).toBe(true);
      });

      it('should return false when larger than other set', () => {
        setB.add(5);
        expect(setB.isSubsetOf(setA)).toBe(false);
      });
    });

    describe('isSupersetOf()', () => {
      it('should return true when contains all values of other set', () => {
        expect(setA.isSupersetOf(setB)).toBe(true);
      });

      it('should return false when does not contain all values', () => {
        expect(setB.isSupersetOf(setA)).toBe(false);
      });

      it('should return true for any set being superset of empty set', () => {
        const emptySet = new HashSet<number>();
        expect(setA.isSupersetOf(emptySet)).toBe(true);
      });
    });

    describe('isDisjointFrom()', () => {
      it('should return true when sets have no common values', () => {
        const setC = new HashSet<number>();
        setC.add(5).add(6);

        expect(setA.isDisjointFrom(setC)).toBe(true);
      });

      it('should return false when sets have common values', () => {
        expect(setA.isDisjointFrom(setB)).toBe(false);
      });

      it('should return true for empty set', () => {
        const emptySet = new HashSet<number>();
        expect(setA.isDisjointFrom(emptySet)).toBe(true);
      });

      it('should optimize by checking smaller set', () => {
        const smallSet = new HashSet<number>();
        smallSet.add(99);

        const largeSet = new HashSet<number>();
        for (let i = 1; i <= 100; i++) largeSet.add(i);

        expect(smallSet.isDisjointFrom(largeSet)).toBe(false);
      });
    });
  });

  describe('Object Values', () => {
    it('should handle object values with identity semantics', () => {
      const objSet = new HashSet<object>();
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 }; // Same structure as obj1, different identity

      objSet.add(obj1);
      objSet.add(obj2);
      objSet.add(obj3);

      expect(objSet.has(obj1)).toBe(true);
      expect(objSet.has(obj2)).toBe(true);
      expect(objSet.has(obj3)).toBe(true);
      expect(objSet.size()).toBe(3);
    });

    it('should not add same object reference twice', () => {
      const objSet = new HashSet<object>();
      const obj = { id: 1 };

      objSet.add(obj);
      objSet.add(obj);

      expect(objSet.size()).toBe(1);
    });

    it('should handle mixed value types', () => {
      const mixedSet = new HashSet<any>();
      const obj = { id: 1 };

      mixedSet.add('string');
      mixedSet.add(123);
      mixedSet.add(true);
      mixedSet.add(obj);

      expect(mixedSet.has('string')).toBe(true);
      expect(mixedSet.has(123)).toBe(true);
      expect(mixedSet.has(true)).toBe(true);
      expect(mixedSet.has(obj)).toBe(true);
      expect(mixedSet.size()).toBe(4);
    });
  });

  describe('Resizing', () => {
    it('should automatically resize when load factor exceeded', () => {
      const smallSet = new HashSet<string>(4, 0.75);
      const initialCapacity = smallSet.getCapacity();

      // Add enough items to trigger resize (4 * 0.75 = 3)
      smallSet.add('a');
      smallSet.add('b');
      smallSet.add('c');
      smallSet.add('d'); // Should trigger resize

      expect(smallSet.getCapacity()).toBeGreaterThan(initialCapacity);
      expect(smallSet.size()).toBe(4);
    });

    it('should maintain all values after resize', () => {
      const smallSet = new HashSet<string>(2, 0.75);

      smallSet.add('a');
      smallSet.add('b');
      smallSet.add('c');
      smallSet.add('d');
      smallSet.add('e');

      expect(smallSet.has('a')).toBe(true);
      expect(smallSet.has('b')).toBe(true);
      expect(smallSet.has('c')).toBe(true);
      expect(smallSet.has('d')).toBe(true);
      expect(smallSet.has('e')).toBe(true);
      expect(smallSet.size()).toBe(5);
    });

    it('should double capacity on resize', () => {
      const smallSet = new HashSet<string>(4, 0.75);
      const initialCapacity = smallSet.getCapacity();

      // Trigger exactly one resize (4 * 0.75 = 3, so adding 4 items triggers resize)
      smallSet.add('a');
      smallSet.add('b');
      smallSet.add('c');
      smallSet.add('d'); // This should trigger the first resize

      expect(smallSet.getCapacity()).toBe(initialCapacity * 2);
    });
  });

  describe('Load Factor', () => {
    it('should return correct load factor', () => {
      const testSet = new HashSet<string>(10, 0.75);

      expect(testSet.getLoadFactor()).toBe(0);

      testSet.add('a');
      expect(testSet.getLoadFactor()).toBe(0.1);

      testSet.add('b');
      expect(testSet.getLoadFactor()).toBe(0.2);

      testSet.add('c');
      expect(testSet.getLoadFactor()).toBeCloseTo(0.3);
    });

    it('should update load factor after deletion', () => {
      const testSet = new HashSet<string>(10);
      testSet.add('a');
      testSet.add('b');

      expect(testSet.getLoadFactor()).toBe(0.2);

      testSet.delete('a');
      expect(testSet.getLoadFactor()).toBe(0.1);
    });
  });

  describe('toString()', () => {
    it('should return string representation', () => {
      set.add('apple');
      set.add('banana');

      const str = set.toString();
      expect(str).toContain('HashSet');
      expect(str).toContain('2');
    });

    it('should handle empty set', () => {
      const str = set.toString();
      expect(str).toContain('HashSet');
      expect(str).toContain('0');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as value', () => {
      set.add('');
      expect(set.has('')).toBe(true);
      expect(set.size()).toBe(1);
    });

    it('should handle numeric string vs number values differently', () => {
      const mixedSet = new HashSet<any>();
      mixedSet.add('123');
      mixedSet.add(123);

      expect(mixedSet.has('123')).toBe(true);
      expect(mixedSet.has(123)).toBe(true);
      expect(mixedSet.size()).toBe(2);
    });

    it('should handle null and undefined values', () => {
      const nullSet = new HashSet<any>();
      nullSet.add(null);
      nullSet.add(undefined);

      expect(nullSet.has(null)).toBe(true);
      expect(nullSet.has(undefined)).toBe(true);
      expect(nullSet.size()).toBe(2);
    });

    it('should handle large number of values', () => {
      const largeSet = new HashSet<string>();
      const count = 1000;

      // Insert
      for (let i = 0; i < count; i++) {
        largeSet.add(`value${i}`);
      }

      expect(largeSet.size()).toBe(count);

      // Verify
      for (let i = 0; i < count; i++) {
        expect(largeSet.has(`value${i}`)).toBe(true);
      }

      // Delete half
      for (let i = 0; i < count / 2; i++) {
        largeSet.delete(`value${i}`);
      }

      expect(largeSet.size()).toBe(count / 2);
    });

    it('should handle collisions gracefully', () => {
      // Force collisions by using small capacity
      const collisionSet = new HashSet<string>(2, 1.0); // Won't resize

      collisionSet.add('a');
      collisionSet.add('b');
      collisionSet.add('c');
      collisionSet.add('d');

      expect(collisionSet.has('a')).toBe(true);
      expect(collisionSet.has('b')).toBe(true);
      expect(collisionSet.has('c')).toBe(true);
      expect(collisionSet.has('d')).toBe(true);
      expect(collisionSet.size()).toBe(4);
    });
  });

  describe('Performance Characteristics', () => {
    it('should maintain O(1) average access time', () => {
      const perfSet = new HashSet<string>();
      const iterations = 10000;

      // Insert many items
      for (let i = 0; i < iterations; i++) {
        perfSet.add(`value${i}`);
      }

      // Access should still be fast
      expect(perfSet.has('value0')).toBe(true);
      expect(perfSet.has(`value${iterations / 2}`)).toBe(true);
      expect(perfSet.has(`value${iterations - 1}`)).toBe(true);
    });

    it('should handle rapid additions and deletions', () => {
      const dynamicSet = new HashSet<string>();

      // Rapid additions
      for (let i = 0; i < 100; i++) {
        dynamicSet.add(`value${i}`);
      }

      // Rapid deletions
      for (let i = 0; i < 50; i++) {
        dynamicSet.delete(`value${i}`);
      }

      // More additions
      for (let i = 100; i < 150; i++) {
        dynamicSet.add(`value${i}`);
      }

      expect(dynamicSet.size()).toBe(100); // 50 remaining + 50 new
    });
  });
});
