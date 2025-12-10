/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import HashMap from './HashMap';

describe('HashMap', () => {
  let map: HashMap<string, number>;

  beforeEach(() => {
    map = new HashMap<string, number>();
  });

  describe('Constructor', () => {
    it('should create an empty map with default capacity', () => {
      expect(map.getSize()).toBe(0);
      expect(map.isEmpty()).toBe(true);
      expect(map.getCapacity()).toBe(16);
    });

    it('should create a map with custom initial capacity', () => {
      const customMap = new HashMap<string, number>(32);
      expect(customMap.getCapacity()).toBe(32);
      expect(customMap.getSize()).toBe(0);
    });

    it('should create a map with custom load factor', () => {
      const customMap = new HashMap<string, number>(16, 0.5);
      expect(customMap.getLoadFactor()).toBe(0);
    });

    it('should throw error for invalid initial capacity', () => {
      expect(() => new HashMap(0)).toThrow('Initial capacity must be positive');
      expect(() => new HashMap(-5)).toThrow(
        'Initial capacity must be positive',
      );
    });

    it('should throw error for invalid load factor', () => {
      expect(() => new HashMap(16, 0)).toThrow(
        'Load factor must be between 0 and 1',
      );
      expect(() => new HashMap(16, 1.5)).toThrow(
        'Load factor must be between 0 and 1',
      );
      expect(() => new HashMap(16, -0.5)).toThrow(
        'Load factor must be between 0 and 1',
      );
    });
  });

  describe('set() and get()', () => {
    it('should set and get a single value', () => {
      map.set('key1', 100);
      expect(map.get('key1')).toBe(100);
    });

    it('should set and get multiple values', () => {
      map.set('key1', 100);
      map.set('key2', 200);
      map.set('key3', 300);

      expect(map.get('key1')).toBe(100);
      expect(map.get('key2')).toBe(200);
      expect(map.get('key3')).toBe(300);
    });

    it('should update existing key with new value', () => {
      map.set('key1', 100);
      map.set('key1', 999);

      expect(map.get('key1')).toBe(999);
      expect(map.getSize()).toBe(1);
    });

    it('should return undefined for non-existent keys', () => {
      expect(map.get('nonexistent')).toBeUndefined();
    });

    it('should handle different value types', () => {
      const multiMap = new HashMap<string, any>();
      multiMap.set('string', 'value');
      multiMap.set('number', 42);
      multiMap.set('boolean', true);
      multiMap.set('null', null);
      multiMap.set('object', { x: 1 });

      expect(multiMap.get('string')).toBe('value');
      expect(multiMap.get('number')).toBe(42);
      expect(multiMap.get('boolean')).toBe(true);
      expect(multiMap.get('null')).toBeNull();
      expect(multiMap.get('object')).toEqual({ x: 1 });
    });
  });

  describe('has()', () => {
    it('should return true for existing keys', () => {
      map.set('key1', 100);
      expect(map.has('key1')).toBe(true);
    });

    it('should return false for non-existent keys', () => {
      expect(map.has('nonexistent')).toBe(false);
    });

    it('should return true after setting a key', () => {
      expect(map.has('key1')).toBe(false);
      map.set('key1', 100);
      expect(map.has('key1')).toBe(true);
    });

    it('should return false after deleting a key', () => {
      map.set('key1', 100);
      expect(map.has('key1')).toBe(true);
      map.delete('key1');
      expect(map.has('key1')).toBe(false);
    });
  });

  describe('delete()', () => {
    it('should delete an existing key', () => {
      map.set('key1', 100);
      const result = map.delete('key1');

      expect(result).toBe(true);
      expect(map.has('key1')).toBe(false);
      expect(map.getSize()).toBe(0);
    });

    it('should return false when deleting non-existent key', () => {
      const result = map.delete('nonexistent');
      expect(result).toBe(false);
    });

    it('should correctly update size after deletion', () => {
      map.set('key1', 100);
      map.set('key2', 200);
      map.set('key3', 300);

      expect(map.getSize()).toBe(3);
      map.delete('key2');
      expect(map.getSize()).toBe(2);
      map.delete('key1');
      expect(map.getSize()).toBe(1);
    });

    it('should handle multiple deletions', () => {
      map.set('key1', 100);
      map.set('key2', 200);

      expect(map.delete('key1')).toBe(true);
      expect(map.delete('key1')).toBe(false); // Already deleted
      expect(map.delete('key2')).toBe(true);
      expect(map.getSize()).toBe(0);
    });
  });

  describe('getSize()', () => {
    it('should return 0 for empty map', () => {
      expect(map.getSize()).toBe(0);
    });

    it('should return correct size after additions', () => {
      map.set('key1', 100);
      expect(map.getSize()).toBe(1);

      map.set('key2', 200);
      expect(map.getSize()).toBe(2);

      map.set('key3', 300);
      expect(map.getSize()).toBe(3);
    });

    it('should not change size when updating existing key', () => {
      map.set('key1', 100);
      map.set('key1', 200);
      expect(map.getSize()).toBe(1);
    });

    it('should decrease size after deletion', () => {
      map.set('key1', 100);
      map.set('key2', 200);
      expect(map.getSize()).toBe(2);

      map.delete('key1');
      expect(map.getSize()).toBe(1);
    });
  });

  describe('isEmpty()', () => {
    it('should return true for empty map', () => {
      expect(map.isEmpty()).toBe(true);
    });

    it('should return false after adding entries', () => {
      map.set('key1', 100);
      expect(map.isEmpty()).toBe(false);
    });

    it('should return true after clearing', () => {
      map.set('key1', 100);
      map.clear();
      expect(map.isEmpty()).toBe(true);
    });
  });

  describe('clear()', () => {
    it('should clear all entries', () => {
      map.set('key1', 100);
      map.set('key2', 200);
      map.set('key3', 300);

      map.clear();

      expect(map.getSize()).toBe(0);
      expect(map.isEmpty()).toBe(true);
      expect(map.has('key1')).toBe(false);
      expect(map.has('key2')).toBe(false);
      expect(map.has('key3')).toBe(false);
    });

    it('should maintain capacity after clear', () => {
      const capacity = map.getCapacity();
      map.set('key1', 100);
      map.clear();
      expect(map.getCapacity()).toBe(capacity);
    });
  });

  describe('forEach()', () => {
    it('should iterate over all entries', () => {
      map.set('a', 1);
      map.set('b', 2);
      map.set('c', 3);

      const entries: Array<[string, number]> = [];
      map.forEach((value, key) => {
        entries.push([key, value]);
      });

      expect(entries).toHaveLength(3);
      expect(entries).toContainEqual(['a', 1]);
      expect(entries).toContainEqual(['b', 2]);
      expect(entries).toContainEqual(['c', 3]);
    });

    it('should not iterate over empty map', () => {
      let count = 0;
      map.forEach(() => count++);
      expect(count).toBe(0);
    });

    it('should pass correct arguments to callback', () => {
      map.set('key1', 100);

      map.forEach((value, key, m) => {
        expect(value).toBe(100);
        expect(key).toBe('key1');
        expect(m).toBe(map);
      });
    });

    it('should respect thisArg', () => {
      map.set('key1', 100);

      const context = { multiplier: 2 };
      let result = 0;

      map.forEach(function (this: typeof context, value) {
        result = value * this.multiplier;
      }, context);

      expect(result).toBe(200);
    });
  });

  describe('Iterators', () => {
    beforeEach(() => {
      map.set('a', 1);
      map.set('b', 2);
      map.set('c', 3);
    });

    describe('keys()', () => {
      it('should return all keys', () => {
        const keys = Array.from(map.keys());
        expect(keys).toHaveLength(3);
        expect(keys).toContain('a');
        expect(keys).toContain('b');
        expect(keys).toContain('c');
      });

      it('should return empty iterator for empty map', () => {
        map.clear();
        const keys = Array.from(map.keys());
        expect(keys).toHaveLength(0);
      });
    });

    describe('values()', () => {
      it('should return all values', () => {
        const values = Array.from(map.values());
        expect(values).toHaveLength(3);
        expect(values).toContain(1);
        expect(values).toContain(2);
        expect(values).toContain(3);
      });

      it('should return empty iterator for empty map', () => {
        map.clear();
        const values = Array.from(map.values());
        expect(values).toHaveLength(0);
      });
    });

    describe('entries()', () => {
      it('should return all entries', () => {
        const entries = Array.from(map.entries());
        expect(entries).toHaveLength(3);
        expect(entries).toContainEqual(['a', 1]);
        expect(entries).toContainEqual(['b', 2]);
        expect(entries).toContainEqual(['c', 3]);
      });

      it('should return empty iterator for empty map', () => {
        map.clear();
        const entries = Array.from(map.entries());
        expect(entries).toHaveLength(0);
      });
    });

    describe('Symbol.iterator', () => {
      it('should make map iterable with for...of', () => {
        const entries: Array<[string, number]> = [];

        for (const entry of map) {
          entries.push(entry);
        }

        expect(entries).toHaveLength(3);
        expect(entries).toContainEqual(['a', 1]);
        expect(entries).toContainEqual(['b', 2]);
        expect(entries).toContainEqual(['c', 3]);
      });

      it('should work with spread operator', () => {
        const entries = [...map];
        expect(entries).toHaveLength(3);
      });
    });
  });

  describe('Object Keys', () => {
    it('should handle object keys with identity semantics', () => {
      const objMap = new HashMap<object, string>();
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const obj3 = { id: 1 }; // Same structure as obj1, different identity

      objMap.set(obj1, 'first');
      objMap.set(obj2, 'second');
      objMap.set(obj3, 'third');

      expect(objMap.get(obj1)).toBe('first');
      expect(objMap.get(obj2)).toBe('second');
      expect(objMap.get(obj3)).toBe('third');
      expect(objMap.getSize()).toBe(3);
    });

    it('should update same object reference', () => {
      const objMap = new HashMap<object, string>();
      const obj = { id: 1 };

      objMap.set(obj, 'first');
      objMap.set(obj, 'updated');

      expect(objMap.get(obj)).toBe('updated');
      expect(objMap.getSize()).toBe(1);
    });

    it('should handle mixed key types', () => {
      const mixedMap = new HashMap<any, string>();
      const obj = { id: 1 };

      mixedMap.set('string', 'a');
      mixedMap.set(123, 'b');
      mixedMap.set(true, 'c');
      mixedMap.set(obj, 'd');

      expect(mixedMap.get('string')).toBe('a');
      expect(mixedMap.get(123)).toBe('b');
      expect(mixedMap.get(true)).toBe('c');
      expect(mixedMap.get(obj)).toBe('d');
      expect(mixedMap.getSize()).toBe(4);
    });
  });

  describe('Resizing', () => {
    it('should automatically resize when load factor exceeded', () => {
      const smallMap = new HashMap<string, number>(4, 0.75);
      const initialCapacity = smallMap.getCapacity();

      // Add enough items to trigger resize (4 * 0.75 = 3)
      smallMap.set('key1', 1);
      smallMap.set('key2', 2);
      smallMap.set('key3', 3);
      smallMap.set('key4', 4); // Should trigger resize

      expect(smallMap.getCapacity()).toBeGreaterThan(initialCapacity);
      expect(smallMap.getSize()).toBe(4);
    });

    it('should maintain all entries after resize', () => {
      const smallMap = new HashMap<string, number>(2, 0.75);

      smallMap.set('key1', 1);
      smallMap.set('key2', 2);
      smallMap.set('key3', 3);
      smallMap.set('key4', 4);
      smallMap.set('key5', 5);

      expect(smallMap.get('key1')).toBe(1);
      expect(smallMap.get('key2')).toBe(2);
      expect(smallMap.get('key3')).toBe(3);
      expect(smallMap.get('key4')).toBe(4);
      expect(smallMap.get('key5')).toBe(5);
      expect(smallMap.getSize()).toBe(5);
    });

    it('should double capacity on resize', () => {
      const smallMap = new HashMap<string, number>(4, 0.75);
      const initialCapacity = smallMap.getCapacity();

      // Trigger exactly one resize (4 * 0.75 = 3, so adding 4 items triggers resize)
      smallMap.set('key1', 1);
      smallMap.set('key2', 2);
      smallMap.set('key3', 3);
      smallMap.set('key4', 4); // This should trigger the first resize

      expect(smallMap.getCapacity()).toBe(initialCapacity * 2);
    });
  });

  describe('Load Factor', () => {
    it('should return correct load factor', () => {
      const testMap = new HashMap<string, number>(10, 0.75);

      expect(testMap.getLoadFactor()).toBe(0);

      testMap.set('key1', 1);
      expect(testMap.getLoadFactor()).toBe(0.1);

      testMap.set('key2', 2);
      expect(testMap.getLoadFactor()).toBe(0.2);

      testMap.set('key3', 3);
      expect(testMap.getLoadFactor()).toBeCloseTo(0.3);
    });

    it('should update load factor after deletion', () => {
      const testMap = new HashMap<string, number>(10);
      testMap.set('key1', 1);
      testMap.set('key2', 2);

      expect(testMap.getLoadFactor()).toBe(0.2);

      testMap.delete('key1');
      expect(testMap.getLoadFactor()).toBe(0.1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string as key', () => {
      map.set('', 100);
      expect(map.get('')).toBe(100);
      expect(map.has('')).toBe(true);
    });

    it('should handle numeric string vs number keys differently', () => {
      const mixedMap = new HashMap<any, string>();
      mixedMap.set('123', 'string key');
      mixedMap.set(123, 'number key');

      // These should be treated as different keys
      expect(mixedMap.get('123')).toBe('string key');
      expect(mixedMap.get(123)).toBe('number key');
      expect(mixedMap.getSize()).toBe(2);
    });

    it('should handle null and undefined values', () => {
      const nullMap = new HashMap<string, any>();
      nullMap.set('null', null);
      nullMap.set('undefined', undefined);

      expect(nullMap.get('null')).toBeNull();
      expect(nullMap.get('undefined')).toBeUndefined();
      expect(nullMap.has('null')).toBe(true);
      expect(nullMap.has('undefined')).toBe(true);
    });

    it('should handle large number of entries', () => {
      const largeMap = new HashMap<string, number>();
      const count = 1000;

      // Insert
      for (let i = 0; i < count; i++) {
        largeMap.set(`key${i}`, i);
      }

      expect(largeMap.getSize()).toBe(count);

      // Verify
      for (let i = 0; i < count; i++) {
        expect(largeMap.get(`key${i}`)).toBe(i);
      }

      // Delete half
      for (let i = 0; i < count / 2; i++) {
        largeMap.delete(`key${i}`);
      }

      expect(largeMap.getSize()).toBe(count / 2);
    });

    it('should handle collisions gracefully', () => {
      // Force collisions by using small capacity
      const collisionMap = new HashMap<string, number>(2, 1.0); // Won't resize

      collisionMap.set('a', 1);
      collisionMap.set('b', 2);
      collisionMap.set('c', 3);
      collisionMap.set('d', 4);

      expect(collisionMap.get('a')).toBe(1);
      expect(collisionMap.get('b')).toBe(2);
      expect(collisionMap.get('c')).toBe(3);
      expect(collisionMap.get('d')).toBe(4);
      expect(collisionMap.getSize()).toBe(4);
    });
  });

  describe('Performance Characteristics', () => {
    it('should maintain O(1) average access time', () => {
      const perfMap = new HashMap<string, number>();
      const iterations = 10000;

      // Insert many items
      for (let i = 0; i < iterations; i++) {
        perfMap.set(`key${i}`, i);
      }

      // Access should still be fast (not a timing test, just verification)
      const startKey = perfMap.get('key0');
      const middleKey = perfMap.get(`key${iterations / 2}`);
      const endKey = perfMap.get(`key${iterations - 1}`);

      expect(startKey).toBe(0);
      expect(middleKey).toBe(iterations / 2);
      expect(endKey).toBe(iterations - 1);
    });

    it('should handle rapid insertions and deletions', () => {
      const dynamicMap = new HashMap<string, number>();

      // Rapid insertions
      for (let i = 0; i < 100; i++) {
        dynamicMap.set(`key${i}`, i);
      }

      // Rapid deletions
      for (let i = 0; i < 50; i++) {
        dynamicMap.delete(`key${i}`);
      }

      // More insertions
      for (let i = 100; i < 150; i++) {
        dynamicMap.set(`key${i}`, i);
      }

      expect(dynamicMap.getSize()).toBe(100); // 50 remaining + 50 new
    });
  });
});
