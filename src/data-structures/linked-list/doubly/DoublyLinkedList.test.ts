import { describe, it, expect, beforeEach } from 'vitest';
import DoublyLinkedList from './DoublyLinkedList';

describe('DoublyLinkedList', () => {
  let list: DoublyLinkedList<number>;

  beforeEach(() => {
    list = new DoublyLinkedList<number>();
  });

  describe('Initial State', () => {
    it('should create an empty list', () => {
      expect(list.size).toBe(0);
      expect(list.isEmpty).toBe(true);
      expect(list.toString()).toBe('[]');
    });
  });

  describe('append()', () => {
    it('should add elements to the end of the list', () => {
      list.append(1);
      expect(list.size).toBe(1);
      expect(list.toString()).toBe('[1]');

      list.append(2);
      list.append(3);
      expect(list.size).toBe(3);
      expect(list.toString()).toBe('[1 <-> 2 <-> 3]');
    });

    it('should handle adding to an empty list', () => {
      list.append(42);
      expect(list.peekFront()).toBe(42);
      expect(list.peekBack()).toBe(42);
    });
  });

  describe('prepend()', () => {
    it('should add elements to the front of the list', () => {
      list.prepend(3);
      list.prepend(2);
      list.prepend(1);
      expect(list.toString()).toBe('[1 <-> 2 <-> 3]');
      expect(list.size).toBe(3);
    });

    it('should handle adding to an empty list', () => {
      list.prepend(42);
      expect(list.peekFront()).toBe(42);
      expect(list.peekBack()).toBe(42);
    });
  });

  describe('shift()', () => {
    it('should remove and return the first element', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      expect(list.shift()).toBe(1);
      expect(list.size).toBe(2);
      expect(list.toString()).toBe('[2 <-> 3]');

      expect(list.shift()).toBe(2);
      expect(list.shift()).toBe(3);
      expect(list.isEmpty).toBe(true);
    });

    it('should return null on empty list', () => {
      expect(list.shift()).toBeNull();
    });

    it('should handle single element list', () => {
      list.append(1);
      expect(list.shift()).toBe(1);
      expect(list.isEmpty).toBe(true);
      expect(list.peekFront()).toBeNull();
      expect(list.peekBack()).toBeNull();
    });
  });

  describe('pop()', () => {
    it('should remove and return the last element', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      expect(list.pop()).toBe(3);
      expect(list.size).toBe(2);
      expect(list.toString()).toBe('[1 <-> 2]');

      expect(list.pop()).toBe(2);
      expect(list.pop()).toBe(1);
      expect(list.isEmpty).toBe(true);
    });

    it('should return null on empty list', () => {
      expect(list.pop()).toBeNull();
    });

    it('should handle single element list', () => {
      list.append(1);
      expect(list.pop()).toBe(1);
      expect(list.isEmpty).toBe(true);
    });
  });

  describe('peekFront() and peekBack()', () => {
    it('should return values without removing them', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      expect(list.peekFront()).toBe(1);
      expect(list.peekBack()).toBe(3);
      expect(list.size).toBe(3); // Size unchanged
    });

    it('should return null on empty list', () => {
      expect(list.peekFront()).toBeNull();
      expect(list.peekBack()).toBeNull();
    });

    it('should return same value for single element', () => {
      list.append(42);
      expect(list.peekFront()).toBe(42);
      expect(list.peekBack()).toBe(42);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      list.append(10);
      list.append(20);
      list.append(30);
      list.append(40);
    });

    it('should get values at valid indices', () => {
      expect(list.get(0)).toBe(10);
      expect(list.get(1)).toBe(20);
      expect(list.get(2)).toBe(30);
      expect(list.get(3)).toBe(40);
    });

    it('should return null for invalid indices', () => {
      expect(list.get(-1)).toBeNull();
      expect(list.get(4)).toBeNull();
      expect(list.get(100)).toBeNull();
    });

    it('should return null on empty list', () => {
      const emptyList = new DoublyLinkedList<number>();
      expect(emptyList.get(0)).toBeNull();
    });
  });

  describe('set()', () => {
    beforeEach(() => {
      list.append(10);
      list.append(20);
      list.append(30);
    });

    it('should update values at valid indices', () => {
      expect(list.set(0, 100)).toBe(true);
      expect(list.get(0)).toBe(100);

      expect(list.set(2, 300)).toBe(true);
      expect(list.get(2)).toBe(300);

      expect(list.toString()).toBe('[100 <-> 20 <-> 300]');
    });

    it('should return false for invalid indices', () => {
      expect(list.set(-1, 999)).toBe(false);
      expect(list.set(3, 999)).toBe(false);
      expect(list.set(100, 999)).toBe(false);
    });
  });

  describe('insert()', () => {
    it('should insert at the beginning', () => {
      list.append(2);
      list.append(3);
      expect(list.insert(0, 1)).toBe(true);
      expect(list.toString()).toBe('[1 <-> 2 <-> 3]');
    });

    it('should insert at the end', () => {
      list.append(1);
      list.append(2);
      expect(list.insert(2, 3)).toBe(true);
      expect(list.toString()).toBe('[1 <-> 2 <-> 3]');
    });

    it('should insert in the middle', () => {
      list.append(1);
      list.append(3);
      expect(list.insert(1, 2)).toBe(true);
      expect(list.toString()).toBe('[1 <-> 2 <-> 3]');
    });

    it('should insert into empty list', () => {
      expect(list.insert(0, 42)).toBe(true);
      expect(list.size).toBe(1);
      expect(list.get(0)).toBe(42);
    });

    it('should return false for invalid indices', () => {
      list.append(1);
      expect(list.insert(-1, 999)).toBe(false);
      expect(list.insert(2, 999)).toBe(false);
      expect(list.size).toBe(1);
    });

    it('should maintain correct size after multiple inserts', () => {
      list.insert(0, 1);
      list.insert(1, 2);
      list.insert(2, 3);
      list.insert(1, 1.5);
      expect(list.size).toBe(4);
      expect(list.toArray()).toEqual([1, 1.5, 2, 3]);
    });
  });

  describe('remove()', () => {
    beforeEach(() => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.append(4);
    });

    it('should remove from the beginning', () => {
      expect(list.remove(0)).toBe(1);
      expect(list.toString()).toBe('[2 <-> 3 <-> 4]');
      expect(list.size).toBe(3);
    });

    it('should remove from the end', () => {
      expect(list.remove(3)).toBe(4);
      expect(list.toString()).toBe('[1 <-> 2 <-> 3]');
      expect(list.size).toBe(3);
    });

    it('should remove from the middle', () => {
      expect(list.remove(2)).toBe(3);
      expect(list.toString()).toBe('[1 <-> 2 <-> 4]');
      expect(list.size).toBe(3);
    });

    it('should return null for invalid indices', () => {
      expect(list.remove(-1)).toBeNull();
      expect(list.remove(4)).toBeNull();
      expect(list.size).toBe(4); // Size unchanged
    });

    it('should handle removing all elements', () => {
      list.remove(0);
      list.remove(0);
      list.remove(0);
      list.remove(0);
      expect(list.isEmpty).toBe(true);
    });
  });

  describe('indexOf()', () => {
    beforeEach(() => {
      list.append(10);
      list.append(20);
      list.append(30);
      list.append(20); // Duplicate
    });

    it('should find the first occurrence of a value', () => {
      expect(list.indexOf(10)).toBe(0);
      expect(list.indexOf(20)).toBe(1); // First occurrence
      expect(list.indexOf(30)).toBe(2);
    });

    it('should return -1 for values not in the list', () => {
      expect(list.indexOf(999)).toBe(-1);
    });

    it('should return -1 for empty list', () => {
      const emptyList = new DoublyLinkedList<number>();
      expect(emptyList.indexOf(1)).toBe(-1);
    });
  });

  describe('contains()', () => {
    beforeEach(() => {
      list.append(1);
      list.append(2);
      list.append(3);
    });

    it('should return true for values in the list', () => {
      expect(list.contains(1)).toBe(true);
      expect(list.contains(2)).toBe(true);
      expect(list.contains(3)).toBe(true);
    });

    it('should return false for values not in the list', () => {
      expect(list.contains(0)).toBe(false);
      expect(list.contains(999)).toBe(false);
    });
  });

  describe('clear()', () => {
    it('should remove all elements', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      list.clear();

      expect(list.size).toBe(0);
      expect(list.isEmpty).toBe(true);
      expect(list.toString()).toBe('[]');
      expect(list.peekFront()).toBeNull();
      expect(list.peekBack()).toBeNull();
    });

    it('should work on already empty list', () => {
      list.clear();
      expect(list.isEmpty).toBe(true);
    });
  });

  describe('reverse()', () => {
    it('should reverse the list', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.append(4);

      list.reverse();

      expect(list.toString()).toBe('[4 <-> 3 <-> 2 <-> 1]');
      expect(list.toArray()).toEqual([4, 3, 2, 1]);
    });

    it('should handle single element list', () => {
      list.append(1);
      list.reverse();
      expect(list.toString()).toBe('[1]');
    });

    it('should handle empty list', () => {
      list.reverse();
      expect(list.isEmpty).toBe(true);
    });

    it('should handle two element list', () => {
      list.append(1);
      list.append(2);
      list.reverse();
      expect(list.toString()).toBe('[2 <-> 1]');
    });

    it('should maintain correct head and tail pointers', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.reverse();

      expect(list.peekFront()).toBe(3);
      expect(list.peekBack()).toBe(1);
    });
  });

  describe('forEach()', () => {
    it('should iterate over all elements', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const values: number[] = [];
      const indices: number[] = [];

      list.forEach((val, idx) => {
        values.push(val);
        indices.push(idx);
      });

      expect(values).toEqual([1, 2, 3]);
      expect(indices).toEqual([0, 1, 2]);
    });

    it('should not execute on empty list', () => {
      let executed = false;
      list.forEach(() => {
        executed = true;
      });
      expect(executed).toBe(false);
    });
  });

  describe('map()', () => {
    it('should transform all elements', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const doubled = list.map((x) => x * 2);
      expect(doubled).toEqual([2, 4, 6]);

      // Original list should be unchanged
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('should handle index parameter', () => {
      list.append(10);
      list.append(20);
      list.append(30);

      const result = list.map((val, idx) => val + idx);
      expect(result).toEqual([10, 21, 32]);
    });

    it('should return empty array for empty list', () => {
      const result = list.map((x) => x * 2);
      expect(result).toEqual([]);
    });

    it('should handle type transformations', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const strings = list.map((x) => `num: ${x}`);
      expect(strings).toEqual(['num: 1', 'num: 2', 'num: 3']);
    });
  });

  describe('filter()', () => {
    it('should filter elements based on predicate', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      list.append(4);
      list.append(5);

      const evens = list.filter((x) => x % 2 === 0);
      expect(evens).toEqual([2, 4]);

      // Original list should be unchanged
      expect(list.size).toBe(5);
    });

    it('should handle index parameter', () => {
      list.append(10);
      list.append(20);
      list.append(30);
      list.append(40);

      const result = list.filter((_, idx) => idx % 2 === 0);
      expect(result).toEqual([10, 30]);
    });

    it('should return empty array when no elements match', () => {
      list.append(1);
      list.append(3);
      list.append(5);

      const evens = list.filter((x) => x % 2 === 0);
      expect(evens).toEqual([]);
    });

    it('should return all elements when all match', () => {
      list.append(2);
      list.append(4);
      list.append(6);

      const evens = list.filter((x) => x % 2 === 0);
      expect(evens).toEqual([2, 4, 6]);
    });
  });

  describe('toArray()', () => {
    it('should convert list to array', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('should return empty array for empty list', () => {
      expect(list.toArray()).toEqual([]);
    });
  });

  describe('toString()', () => {
    it('should format empty list', () => {
      expect(list.toString()).toBe('[]');
    });

    it('should format single element', () => {
      list.append(42);
      expect(list.toString()).toBe('[42]');
    });

    it('should format multiple elements', () => {
      list.append(1);
      list.append(2);
      list.append(3);
      expect(list.toString()).toBe('[1 <-> 2 <-> 3]');
    });

    it('should handle different types', () => {
      const stringList = new DoublyLinkedList<string>();
      stringList.append('hello');
      stringList.append('world');
      expect(stringList.toString()).toBe('[hello <-> world]');
    });
  });

  describe('Iterator', () => {
    it('should work with for...of loop', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const values: number[] = [];
      for (const val of list) {
        values.push(val);
      }

      expect(values).toEqual([1, 2, 3]);
    });

    it('should work with spread operator', () => {
      list.append(1);
      list.append(2);
      list.append(3);

      const values = [...list];
      expect(values).toEqual([1, 2, 3]);
    });

    it('should handle empty list', () => {
      const values = [...list];
      expect(values).toEqual([]);
    });
  });

  describe('Generic Types', () => {
    it('should work with strings', () => {
      const stringList = new DoublyLinkedList<string>();
      stringList.append('a');
      stringList.append('b');
      stringList.append('c');

      expect(stringList.toString()).toBe('[a <-> b <-> c]');
      expect(stringList.contains('b')).toBe(true);
    });

    it('should work with objects', () => {
      interface Person {
        name: string;
        age: number;
      }

      const personList = new DoublyLinkedList<Person>();
      personList.append({ name: 'Alice', age: 30 });
      personList.append({ name: 'Bob', age: 25 });

      expect(personList.size).toBe(2);
      expect(personList.get(0)).toEqual({ name: 'Alice', age: 30 });
    });
  });

  describe('Edge Cases and Stress Tests', () => {
    it('should handle large lists efficiently', () => {
      const n = 10000;
      for (let i = 0; i < n; i++) {
        list.append(i);
      }

      expect(list.size).toBe(n);
      expect(list.get(0)).toBe(0);
      expect(list.get(n - 1)).toBe(n - 1);
      expect(list.get(Math.floor(n / 2))).toBe(Math.floor(n / 2));
    });

    it('should handle alternating operations', () => {
      list.append(1);
      list.prepend(0);
      list.append(2);
      list.shift();
      list.pop();
      list.append(3);

      expect(list.toArray()).toEqual([1, 3]);
    });

    it('should maintain integrity after complex operations', () => {
      list.append(1); // [1]
      list.append(2); // [1 <-> 2]
      list.append(3); // [1 <-> 2 <-> 3]
      list.reverse(); // [3 <-> 2 <-> 1]
      list.insert(1, 2.5); // [3 <-> 2.5 <-> 2 <-> 1]
      list.remove(0); // [2.5 <-> 2 <-> 1]
      list.set(0, 100); // [100 <-> 2 <-> 1]

      expect(list.toString()).toBe('[100 <-> 2 <-> 1]');
      expect(list.size).toBe(3);
      expect(list.peekFront()).toBe(100);
      expect(list.peekBack()).toBe(1);
    });
  });
});
