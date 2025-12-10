import { describe, it, expect, beforeEach } from 'vitest';
import DynamicArray from './DynamicArray';

describe('DynamicArray', () => {
  describe('constructor', () => {
    it('should create an empty array with default capacity', () => {
      const arr = new DynamicArray<number>();

      expect(arr.length).toBe(0);
      expect(arr.currentCapacity).toBe(4);
    });

    it('should create an empty array with custom capacity', () => {
      const arr = new DynamicArray<number>(8);

      expect(arr.length).toBe(0);
      expect(arr.currentCapacity).toBe(8);
    });

    it('should enforce minimum capacity of 1', () => {
      const arr = new DynamicArray<number>(0);

      expect(arr.currentCapacity).toBe(1);
    });

    it('should handle negative initial capacity', () => {
      const arr = new DynamicArray<number>(-5);

      expect(arr.currentCapacity).toBe(1);
    });
  });

  describe('push', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>(2);
    });

    it('should add items to the array', () => {
      arr.push(1);
      arr.push(2);

      expect(arr.length).toBe(2);
      expect(arr.get(0)).toBe(1);
      expect(arr.get(1)).toBe(2);
    });

    it('should double capacity when full', () => {
      arr.push(1);
      arr.push(2);

      expect(arr.currentCapacity).toBe(2);

      arr.push(3);

      expect(arr.currentCapacity).toBe(4);
      expect(arr.length).toBe(3);
    });

    it('should handle multiple resizes', () => {
      for (let i = 0; i < 10; i++) {
        arr.push(i);
      }

      expect(arr.length).toBe(10);
      expect(arr.currentCapacity).toBeGreaterThanOrEqual(10);
    });

    it('should work with different types', () => {
      const strArr = new DynamicArray<string>(2);

      strArr.push('hello');
      strArr.push('world');

      expect(strArr.get(0)).toBe('hello');
      expect(strArr.get(1)).toBe('world');
    });
  });

  describe('pop', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>(4);
      arr.push(1);
      arr.push(2);
      arr.push(3);
    });

    it('should remove and return the last item', () => {
      const item = arr.pop();

      expect(item).toBe(3);
      expect(arr.length).toBe(2);
    });

    it('should throw error on empty array', () => {
      const emptyArr = new DynamicArray<number>();

      expect(() => emptyArr.pop()).toThrow('Cannot pop from empty array');
    });

    it('should shrink capacity when utilization is low', () => {
      const bigArr = new DynamicArray<number>(2);

      for (let i = 0; i < 10; i++) {
        bigArr.push(i);
      }

      const initialCapacity = bigArr.currentCapacity;

      // Pop enough items to trigger shrinking
      for (let i = 0; i < 8; i++) {
        bigArr.pop();
      }

      expect(bigArr.currentCapacity).toBeLessThan(initialCapacity);
    });

    it('should not shrink below minimum capacity', () => {
      const minCapacity = arr.currentCapacity;

      arr.pop();
      arr.pop();
      arr.pop();

      expect(arr.currentCapacity).toBe(minCapacity);
    });
  });

  describe('get', () => {
    let arr: DynamicArray<string>;

    beforeEach(() => {
      arr = new DynamicArray<string>();

      arr.push('a');
      arr.push('b');
      arr.push('c');
    });

    it('should return element at valid index', () => {
      expect(arr.get(0)).toBe('a');
      expect(arr.get(1)).toBe('b');
      expect(arr.get(2)).toBe('c');
    });

    it('should throw error for negative index', () => {
      expect(() => arr.get(-1)).toThrow('Index out of bounds');
    });

    it('should throw error for index >= length', () => {
      expect(() => arr.get(3)).toThrow('Index out of bounds');
    });

    it('should throw error for empty array', () => {
      const emptyArr = new DynamicArray<string>();

      expect(() => emptyArr.get(0)).toThrow('Index out of bounds');
    });
  });

  describe('set', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>();

      arr.push(1);
      arr.push(2);
      arr.push(3);
    });

    it('should update element at valid index', () => {
      arr.set(1, 99);

      expect(arr.get(1)).toBe(99);
      expect(arr.length).toBe(3);
    });

    it('should throw error for negative index', () => {
      expect(() => arr.set(-1, 99)).toThrow('Index out of bounds');
    });

    it('should throw error for index >= length', () => {
      expect(() => arr.set(3, 99)).toThrow('Index out of bounds');
    });
  });

  describe('removeAt', () => {
    let arr: DynamicArray<string>;

    beforeEach(() => {
      arr = new DynamicArray<string>(4);
      arr.push('a');
      arr.push('b');
      arr.push('c');
      arr.push('d');
    });

    it('should remove element at index and shift left', () => {
      const removed = arr.removeAt(1);

      expect(removed).toBe('b');
      expect(arr.length).toBe(3);
      expect(arr.get(0)).toBe('a');
      expect(arr.get(1)).toBe('c');
      expect(arr.get(2)).toBe('d');
    });

    it('should remove first element', () => {
      arr.removeAt(0);

      expect(arr.length).toBe(3);
      expect(arr.get(0)).toBe('b');
    });

    it('should remove last element', () => {
      arr.removeAt(3);

      expect(arr.length).toBe(3);
      expect(arr.get(2)).toBe('c');
    });

    it('should throw error for invalid index', () => {
      expect(() => arr.removeAt(-1)).toThrow('Index out of bounds');
      expect(() => arr.removeAt(4)).toThrow('Index out of bounds');
    });

    it('should trigger shrinking when appropriate', () => {
      const bigArr = new DynamicArray<number>(2);

      for (let i = 0; i < 10; i++) {
        bigArr.push(i);
      }

      const initialCapacity = bigArr.currentCapacity;

      for (let i = 0; i < 8; i++) {
        bigArr.removeAt(0);
      }

      expect(bigArr.currentCapacity).toBeLessThan(initialCapacity);
    });
  });

  describe('insert', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>(4);

      arr.push(1);
      arr.push(2);
      arr.push(3);
    });

    it('should insert at beginning', () => {
      arr.insert(0, 0);

      expect(arr.length).toBe(4);
      expect(arr.get(0)).toBe(0);
      expect(arr.get(1)).toBe(1);
    });

    it('should insert in middle', () => {
      arr.insert(1, 99);

      expect(arr.length).toBe(4);
      expect(arr.get(0)).toBe(1);
      expect(arr.get(1)).toBe(99);
      expect(arr.get(2)).toBe(2);
    });

    it('should insert at end', () => {
      arr.insert(3, 4);

      expect(arr.length).toBe(4);
      expect(arr.get(3)).toBe(4);
    });

    it('should trigger resize when capacity is full', () => {
      arr.push(4); // Fill to capacity

      const oldCapacity = arr.currentCapacity;
      arr.insert(0, 0);

      expect(arr.currentCapacity).toBeGreaterThan(oldCapacity);
    });

    it('should throw error for invalid index', () => {
      expect(() => arr.insert(-1, 99)).toThrow('Index out of bounds');
      expect(() => arr.insert(4, 99)).toThrow('Index out of bounds');
    });
  });

  describe('indexOf', () => {
    let arr: DynamicArray<string>;

    beforeEach(() => {
      arr = new DynamicArray<string>();

      arr.push('apple');
      arr.push('banana');
      arr.push('cherry');
      arr.push('banana');
    });

    it('should return index of first occurrence', () => {
      expect(arr.indexOf('banana')).toBe(1);
    });

    it('should return -1 for non-existent item', () => {
      expect(arr.indexOf('grape')).toBe(-1);
    });

    it('should return 0 for first element', () => {
      expect(arr.indexOf('apple')).toBe(0);
    });

    it('should work with empty array', () => {
      const emptyArr = new DynamicArray<string>();

      expect(emptyArr.indexOf('test')).toBe(-1);
    });
  });

  describe('contains', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>();

      arr.push(1);
      arr.push(2);
      arr.push(3);
    });

    it('should return true for existing items', () => {
      expect(arr.contains(1)).toBe(true);
      expect(arr.contains(2)).toBe(true);
      expect(arr.contains(3)).toBe(true);
    });

    it('should return false for non-existent items', () => {
      expect(arr.contains(0)).toBe(false);
      expect(arr.contains(4)).toBe(false);
    });
  });

  describe('clear', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>(2);

      for (let i = 0; i < 10; i++) {
        arr.push(i);
      }
    });

    it('should remove all elements', () => {
      arr.clear();

      expect(arr.length).toBe(0);
      expect(arr.isEmpty()).toBe(true);
    });

    it('should reset to minimum capacity', () => {
      const minCapacity = 2;

      arr.clear();

      expect(arr.currentCapacity).toBe(minCapacity);
    });

    it('should allow adding after clear', () => {
      arr.clear();
      arr.push(99);

      expect(arr.length).toBe(1);
      expect(arr.get(0)).toBe(99);
    });
  });

  describe('isEmpty', () => {
    it('should return true for new array', () => {
      const arr = new DynamicArray<number>();

      expect(arr.isEmpty()).toBe(true);
    });

    it('should return false after adding items', () => {
      const arr = new DynamicArray<number>();

      arr.push(1);

      expect(arr.isEmpty()).toBe(false);
    });

    it('should return true after removing all items', () => {
      const arr = new DynamicArray<number>();

      arr.push(1);
      arr.pop();

      expect(arr.isEmpty()).toBe(true);
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty DynamicArray', () => {
      const arr = new DynamicArray<number>();

      expect(arr.toArray()).toEqual([]);
    });

    it('should return array with all elements', () => {
      const arr = new DynamicArray<number>();

      arr.push(1);
      arr.push(2);
      arr.push(3);

      expect(arr.toArray()).toEqual([1, 2, 3]);
    });

    it('should not include unused capacity', () => {
      const arr = new DynamicArray<number>(10);

      arr.push(1);
      arr.push(2);

      const result = arr.toArray();

      expect(result.length).toBe(2);
      expect(result).toEqual([1, 2]);
    });
  });

  describe('iterator', () => {
    it('should iterate over all elements', () => {
      const arr = new DynamicArray<number>();

      arr.push(1);
      arr.push(2);
      arr.push(3);

      const result: number[] = [];
      for (const item of arr) {
        result.push(item);
      }

      expect(result).toEqual([1, 2, 3]);
    });

    it('should work with spread operator', () => {
      const arr = new DynamicArray<string>();

      arr.push('a');
      arr.push('b');
      arr.push('c');

      expect([...arr]).toEqual(['a', 'b', 'c']);
    });

    it('should work with Array.from', () => {
      const arr = new DynamicArray<number>();
      arr.push(10);
      arr.push(20);

      expect(Array.from(arr)).toEqual([10, 20]);
    });

    it('should iterate zero times for empty array', () => {
      const arr = new DynamicArray<number>();
      const result: number[] = [];

      for (const item of arr) {
        result.push(item);
      }

      expect(result).toEqual([]);
    });
  });

  describe('unshift', () => {
    let arr: DynamicArray<string>;

    beforeEach(() => {
      arr = new DynamicArray<string>(4);

      arr.push('b');
      arr.push('c');
      arr.push('d');
    });

    it('should add item to the beginning', () => {
      arr.unshift('a');

      expect(arr.length).toBe(4);
      expect(arr.get(0)).toBe('a');
      expect(arr.get(1)).toBe('b');
    });

    it('should trigger resize when capacity is full', () => {
      arr.push('e'); // Fill to capacity

      const oldCapacity = arr.currentCapacity;
      arr.unshift('a');

      expect(arr.currentCapacity).toBeGreaterThan(oldCapacity);
    });

    it('should work on empty array', () => {
      const emptyArr = new DynamicArray<number>();

      emptyArr.unshift(1);

      expect(emptyArr.length).toBe(1);
      expect(emptyArr.get(0)).toBe(1);
    });

    it('should handle multiple unshifts', () => {
      arr.unshift('a');
      arr.unshift('0');

      expect(arr.toArray()).toEqual(['0', 'a', 'b', 'c', 'd']);
    });
  });

  describe('shift', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>(4);

      arr.push(1);
      arr.push(2);
      arr.push(3);
    });

    it('should remove and return first item', () => {
      const item = arr.shift();

      expect(item).toBe(1);
      expect(arr.length).toBe(2);
      expect(arr.get(0)).toBe(2);
    });

    it('should throw error on empty array', () => {
      const emptyArr = new DynamicArray<number>();

      expect(() => emptyArr.shift()).toThrow('Cannot shift from empty array');
    });

    it('should trigger shrinking when appropriate', () => {
      const bigArr = new DynamicArray<number>(2);

      for (let i = 0; i < 10; i++) {
        bigArr.push(i);
      }
      const initialCapacity = bigArr.currentCapacity;

      for (let i = 0; i < 8; i++) {
        bigArr.shift();
      }

      expect(bigArr.currentCapacity).toBeLessThan(initialCapacity);
    });

    it('should handle shifting until empty', () => {
      arr.shift();
      arr.shift();
      arr.shift();

      expect(arr.isEmpty()).toBe(true);
    });
  });

  describe('forEach', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>();

      arr.push(1);
      arr.push(2);
      arr.push(3);
    });

    it('should execute callback for each element', () => {
      const result: number[] = [];

      arr.forEach((item) => result.push(item));

      expect(result).toEqual([1, 2, 3]);
    });

    it('should provide index to callback', () => {
      const indices: number[] = [];

      arr.forEach((_, index) => indices.push(index));

      expect(indices).toEqual([0, 1, 2]);
    });

    it('should not execute on empty array', () => {
      const emptyArr = new DynamicArray<number>();

      let count = 0;
      emptyArr.forEach(() => count++);

      expect(count).toBe(0);
    });

    it('should allow side effects', () => {
      const doubled: number[] = [];

      arr.forEach((item) => doubled.push(item * 2));

      expect(doubled).toEqual([2, 4, 6]);
    });
  });

  describe('map', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>();

      arr.push(1);
      arr.push(2);
      arr.push(3);
    });

    it('should transform elements', () => {
      const doubled = arr.map((x) => x * 2);

      expect(doubled).toEqual([2, 4, 6]);
    });

    it('should change element type', () => {
      const strings = arr.map((x) => `num${x}`);

      expect(strings).toEqual(['num1', 'num2', 'num3']);
    });

    it('should provide index to callback', () => {
      const withIndex = arr.map((item, index) => `${index}:${item}`);

      expect(withIndex).toEqual(['0:1', '1:2', '2:3']);
    });

    it('should return empty array for empty DynamicArray', () => {
      const emptyArr = new DynamicArray<number>();

      const result = emptyArr.map((x) => x * 2);

      expect(result).toEqual([]);
    });

    it('should not modify original array', () => {
      arr.map((x) => x * 10);

      expect(arr.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('filter', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>();

      arr.push(1);
      arr.push(2);
      arr.push(3);
      arr.push(4);
      arr.push(5);
    });

    it('should filter elements based on predicate', () => {
      const evens = arr.filter((x) => x % 2 === 0);

      expect(evens).toEqual([2, 4]);
    });

    it('should provide index to callback', () => {
      const result = arr.filter((_, index) => index > 2);

      expect(result).toEqual([4, 5]);
    });

    it('should return empty array when no elements match', () => {
      const result = arr.filter((x) => x > 10);

      expect(result).toEqual([]);
    });

    it('should return all elements when all match', () => {
      const result = arr.filter((x) => x > 0);

      expect(result).toEqual([1, 2, 3, 4, 5]);
    });

    it('should not modify original array', () => {
      arr.filter((x) => x > 3);

      expect(arr.toArray()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('reduce', () => {
    let arr: DynamicArray<number>;

    beforeEach(() => {
      arr = new DynamicArray<number>();

      arr.push(1);
      arr.push(2);
      arr.push(3);
      arr.push(4);
    });

    it('should sum all elements', () => {
      const sum = arr.reduce((acc, x) => acc + x, 0);

      expect(sum).toBe(10);
    });

    it('should multiply all elements', () => {
      const product = arr.reduce((acc, x) => acc * x, 1);

      expect(product).toBe(24);
    });

    it('should build complex objects', () => {
      const obj = arr.reduce((acc, x, i) => {
        acc[`key${i}`] = x;
        return acc;
      }, {} as Record<string, number>);

      expect(obj).toEqual({
        key0: 1,
        key1: 2,
        key2: 3,
        key3: 4,
      });
    });

    it('should handle different accumulator type', () => {
      const strArr = new DynamicArray<number>();

      strArr.push(1);
      strArr.push(2);
      strArr.push(3);

      const result = strArr.reduce((acc, x) => acc + x.toString(), '');

      expect(result).toBe('123');
    });

    it('should return initial value for empty array', () => {
      const emptyArr = new DynamicArray<number>();

      const result = emptyArr.reduce((acc, x) => acc + x, 100);

      expect(result).toBe(100);
    });

    it('should provide index to callback', () => {
      const indices = arr.reduce((acc, _, i) => {
        acc.push(i);
        return acc;
      }, [] as number[]);

      expect(indices).toEqual([0, 1, 2, 3]);
    });
  });

  describe('complex operations', () => {
    it('should handle multiple operations correctly', () => {
      const arr = new DynamicArray<number>(2);

      arr.push(1);
      arr.push(2);
      arr.push(3);
      arr.insert(1, 99);
      arr.removeAt(0);
      arr.set(1, 88);

      expect(arr.toArray()).toEqual([99, 88, 3]);
    });

    it('should maintain integrity through resize cycles', () => {
      const arr = new DynamicArray<number>(2);

      // Grow
      for (let i = 0; i < 20; i++) {
        arr.push(i);
      }

      // Shrink
      for (let i = 0; i < 15; i++) {
        arr.pop();
      }

      expect(arr.length).toBe(5);
      expect(arr.toArray()).toEqual([0, 1, 2, 3, 4]);
    });

    it('should work with object types', () => {
      interface Person {
        name: string;
        age: number;
      }

      const arr = new DynamicArray<Person>();
      arr.push({ name: 'Alice', age: 30 });
      arr.push({ name: 'Bob', age: 25 });

      expect(arr.get(0).name).toBe('Alice');
      expect(arr.length).toBe(2);
    });
  });
});
