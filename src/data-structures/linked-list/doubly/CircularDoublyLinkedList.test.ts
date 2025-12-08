import { describe, it, expect, beforeEach } from 'vitest';
import CircularDoublyLinkedList from './CircularDoublyLinkedList';

describe('CircularDoublyLinkedList', () => {
  let list: CircularDoublyLinkedList<number>;

  beforeEach(() => {
    list = new CircularDoublyLinkedList<number>();
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
      expect(list.toString()).toBe('[1 ⟲]');

      list.append(2).append(3);

      expect(list.size).toBe(3);
      expect(list.toString()).toBe('[1 ↔ 2 ↔ 3 ⟲]');
    });

    it('should maintain circular structure', () => {
      list.append(1).append(2).append(3);

      expect(list.getFirst()).toBe(1);
      expect(list.getLast()).toBe(3);
    });

    it('should handle single element circular reference', () => {
      list.append(42);

      expect(list.getFirst()).toBe(42);
      expect(list.getLast()).toBe(42);
    });

    it('should support method chaining', () => {
      const result = list.append(1).append(2).append(3);

      expect(result).toBe(list);
      expect(list.size).toBe(3);
    });
  });

  describe('prepend()', () => {
    it('should add elements to the beginning of the list', () => {
      list.prepend(3).prepend(2).prepend(1);

      expect(list.toString()).toBe('[1 ↔ 2 ↔ 3 ⟲]');
      expect(list.size).toBe(3);
    });

    it('should maintain circular structure', () => {
      list.prepend(1).prepend(2);

      expect(list.getFirst()).toBe(2);
      expect(list.getLast()).toBe(1);
    });

    it('should support method chaining', () => {
      const result = list.prepend(1).prepend(2);

      expect(result).toBe(list);
    });
  });

  describe('insertAt()', () => {
    it('should insert at the beginning', () => {
      list.append(2).append(3);

      expect(list.insertAt(0, 1)).toBe(true);
      expect(list.toString()).toBe('[1 ↔ 2 ↔ 3 ⟲]');
    });

    it('should insert at the end', () => {
      list.append(1).append(2);

      expect(list.insertAt(2, 3)).toBe(true);
      expect(list.toString()).toBe('[1 ↔ 2 ↔ 3 ⟲]');
    });

    it('should insert in the middle', () => {
      list.append(1).append(3);

      expect(list.insertAt(1, 2)).toBe(true);
      expect(list.toString()).toBe('[1 ↔ 2 ↔ 3 ⟲]');
    });

    it('should insert into empty list', () => {
      expect(list.insertAt(0, 42)).toBe(true);
      expect(list.size).toBe(1);
      expect(list.get(0)).toBe(42);
    });

    it('should return false for invalid indices', () => {
      list.append(1);

      expect(list.insertAt(-1, 999)).toBe(false);
      expect(list.insertAt(2, 999)).toBe(false);
      expect(list.size).toBe(1);
    });

    it('should maintain circular structure after insertion', () => {
      list.append(1).append(3);
      list.insertAt(1, 2);

      expect(list.getFirst()).toBe(1);
      expect(list.getLast()).toBe(3);
    });
  });

  describe('removeFirst()', () => {
    it('should remove and return the first element', () => {
      list.append(1).append(2).append(3);

      expect(list.removeFirst()).toBe(1);
      expect(list.size).toBe(2);
      expect(list.toString()).toBe('[2 ↔ 3 ⟲]');

      expect(list.removeFirst()).toBe(2);
      expect(list.removeFirst()).toBe(3);
      expect(list.isEmpty).toBe(true);
    });

    it('should return undefined on empty list', () => {
      expect(list.removeFirst()).toBeUndefined();
    });

    it('should handle single element list', () => {
      list.append(1);

      expect(list.removeFirst()).toBe(1);
      expect(list.isEmpty).toBe(true);
      expect(list.getFirst()).toBeUndefined();
      expect(list.getLast()).toBeUndefined();
    });

    it('should maintain circular structure', () => {
      list.append(1).append(2).append(3);
      list.removeFirst();

      expect(list.getFirst()).toBe(2);
      expect(list.getLast()).toBe(3);
    });
  });

  describe('removeLast()', () => {
    it('should remove and return the last element', () => {
      list.append(1).append(2).append(3);

      expect(list.removeLast()).toBe(3);
      expect(list.size).toBe(2);
      expect(list.toString()).toBe('[1 ↔ 2 ⟲]');

      expect(list.removeLast()).toBe(2);
      expect(list.removeLast()).toBe(1);
      expect(list.isEmpty).toBe(true);
    });

    it('should return undefined on empty list', () => {
      expect(list.removeLast()).toBeUndefined();
    });

    it('should handle single element list', () => {
      list.append(1);

      expect(list.removeLast()).toBe(1);
      expect(list.isEmpty).toBe(true);
    });

    it('should maintain circular structure', () => {
      list.append(1).append(2).append(3);
      list.removeLast();

      expect(list.getFirst()).toBe(1);
      expect(list.getLast()).toBe(2);
    });
  });

  describe('removeAt()', () => {
    beforeEach(() => {
      list.append(1).append(2).append(3).append(4);
    });

    it('should remove from the beginning', () => {
      expect(list.removeAt(0)).toBe(1);
      expect(list.toString()).toBe('[2 ↔ 3 ↔ 4 ⟲]');
      expect(list.size).toBe(3);
    });

    it('should remove from the end', () => {
      expect(list.removeAt(3)).toBe(4);
      expect(list.toString()).toBe('[1 ↔ 2 ↔ 3 ⟲]');
      expect(list.size).toBe(3);
    });

    it('should remove from the middle', () => {
      expect(list.removeAt(2)).toBe(3);
      expect(list.toString()).toBe('[1 ↔ 2 ↔ 4 ⟲]');
      expect(list.size).toBe(3);
    });

    it('should return undefined for invalid indices', () => {
      expect(list.removeAt(-1)).toBeUndefined();
      expect(list.removeAt(4)).toBeUndefined();
      expect(list.size).toBe(4);
    });

    it('should maintain circular structure', () => {
      list.removeAt(1);

      expect(list.getFirst()).toBe(1);
      expect(list.getLast()).toBe(4);
    });
  });

  describe('get()', () => {
    beforeEach(() => {
      list.append(10).append(20).append(30).append(40);
    });

    it('should get values at valid indices', () => {
      expect(list.get(0)).toBe(10);
      expect(list.get(1)).toBe(20);
      expect(list.get(2)).toBe(30);
      expect(list.get(3)).toBe(40);
    });

    it('should return undefined for invalid indices', () => {
      expect(list.get(-1)).toBeUndefined();
      expect(list.get(4)).toBeUndefined();
      expect(list.get(100)).toBeUndefined();
    });

    it('should return undefined on empty list', () => {
      const emptyList = new CircularDoublyLinkedList<number>();

      expect(emptyList.get(0)).toBeUndefined();
    });
  });

  describe('set()', () => {
    beforeEach(() => {
      list.append(10).append(20).append(30);
    });

    it('should update values at valid indices', () => {
      expect(list.set(0, 100)).toBe(true);
      expect(list.get(0)).toBe(100);

      expect(list.set(2, 300)).toBe(true);
      expect(list.get(2)).toBe(300);

      expect(list.toString()).toBe('[100 ↔ 20 ↔ 300 ⟲]');
    });

    it('should return false for invalid indices', () => {
      expect(list.set(-1, 999)).toBe(false);
      expect(list.set(3, 999)).toBe(false);
      expect(list.set(100, 999)).toBe(false);
    });
  });

  describe('indexOf()', () => {
    beforeEach(() => {
      list.append(10).append(20).append(30).append(20);
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
      const emptyList = new CircularDoublyLinkedList<number>();

      expect(emptyList.indexOf(1)).toBe(-1);
    });
  });

  describe('contains()', () => {
    beforeEach(() => {
      list.append(1).append(2).append(3);
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

  describe('getFirst() and getLast()', () => {
    it('should return values without removing them', () => {
      list.append(1).append(2).append(3);

      expect(list.getFirst()).toBe(1);
      expect(list.getLast()).toBe(3);
      expect(list.size).toBe(3); // Size unchanged
    });

    it('should return undefined on empty list', () => {
      expect(list.getFirst()).toBeUndefined();
      expect(list.getLast()).toBeUndefined();
    });

    it('should return same value for single element', () => {
      list.append(42);

      expect(list.getFirst()).toBe(42);
      expect(list.getLast()).toBe(42);
    });
  });

  describe('peekFront() and peekBack()', () => {
    it('should work as aliases for getFirst/getLast', () => {
      list.append(1).append(2).append(3);

      expect(list.peekFront()).toBe(1);
      expect(list.peekBack()).toBe(3);
      expect(list.peekFront()).toBe(list.getFirst());
      expect(list.peekBack()).toBe(list.getLast());
    });
  });

  describe('rotate()', () => {
    beforeEach(() => {
      list.append(1).append(2).append(3).append(4);
    });

    it('should rotate forward by default (1 position)', () => {
      list.rotate();

      expect(list.toString()).toBe('[2 ↔ 3 ↔ 4 ↔ 1 ⟲]');
      expect(list.getFirst()).toBe(2);
      expect(list.getLast()).toBe(1);
    });

    it('should rotate forward by n positions', () => {
      list.rotate(2);

      expect(list.toString()).toBe('[3 ↔ 4 ↔ 1 ↔ 2 ⟲]');
    });

    it('should rotate backward with negative values', () => {
      list.rotate(-1);

      expect(list.toString()).toBe('[4 ↔ 1 ↔ 2 ↔ 3 ⟲]');
    });

    it('should handle rotation equal to list size', () => {
      list.rotate(4);

      expect(list.toString()).toBe('[1 ↔ 2 ↔ 3 ↔ 4 ⟲]');
    });

    it('should handle rotation larger than list size', () => {
      list.rotate(6); // Same as rotate(2)

      expect(list.toString()).toBe('[3 ↔ 4 ↔ 1 ↔ 2 ⟲]');
    });

    it('should handle rotation on single element', () => {
      const singleList = new CircularDoublyLinkedList<number>();

      singleList.append(1);
      singleList.rotate(5);

      expect(singleList.toString()).toBe('[1 ⟲]');
    });

    it('should handle rotation on empty list', () => {
      list.clear().rotate(3);

      expect(list.isEmpty).toBe(true);
    });

    it('should support method chaining', () => {
      const result = list.rotate(1);

      expect(result).toBe(list);
    });
  });

  describe('reverse()', () => {
    it('should reverse the list', () => {
      list.append(1).append(2).append(3).append(4);
      list.reverse();

      expect(list.toString()).toBe('[4 ↔ 3 ↔ 2 ↔ 1 ⟲]');
      expect(list.toArray()).toEqual([4, 3, 2, 1]);
    });

    it('should handle single element list', () => {
      list.append(1);
      list.reverse();

      expect(list.toString()).toBe('[1 ⟲]');
    });

    it('should handle empty list', () => {
      list.reverse();

      expect(list.isEmpty).toBe(true);
    });

    it('should handle two element list', () => {
      list.append(1).append(2);
      list.reverse();

      expect(list.toString()).toBe('[2 ↔ 1 ⟲]');
    });

    it('should maintain correct head and tail pointers', () => {
      list.append(1).append(2).append(3);
      list.reverse();

      expect(list.getFirst()).toBe(3);
      expect(list.getLast()).toBe(1);
    });

    it('should maintain circular structure', () => {
      list.append(1).append(2).append(3);
      list.reverse();

      expect(list.getFirst()).toBe(3);
      expect(list.getLast()).toBe(1);
    });

    it('should support method chaining', () => {
      const result = list.append(1).append(2).reverse();

      expect(result).toBe(list);
    });
  });

  describe('clear()', () => {
    it('should remove all elements', () => {
      list.append(1).append(2).append(3);
      list.clear();

      expect(list.size).toBe(0);
      expect(list.isEmpty).toBe(true);
      expect(list.toString()).toBe('[]');
      expect(list.getFirst()).toBeUndefined();
      expect(list.getLast()).toBeUndefined();
    });

    it('should work on already empty list', () => {
      list.clear();

      expect(list.isEmpty).toBe(true);
    });

    it('should support method chaining', () => {
      const result = list.append(1).clear();

      expect(result).toBe(list);
    });
  });

  describe('forEach()', () => {
    it('should iterate over all elements', () => {
      list.append(1).append(2).append(3);

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
      list.append(1).append(2).append(3);

      const doubled = list.map((x) => x * 2);

      expect(doubled).toEqual([2, 4, 6]);

      // Original list should be unchanged
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('should handle index parameter', () => {
      list.append(10).append(20).append(30);

      const result = list.map((val, idx) => val + idx);

      expect(result).toEqual([10, 21, 32]);
    });

    it('should return empty array for empty list', () => {
      const result = list.map((x) => x * 2);

      expect(result).toEqual([]);
    });

    it('should handle type transformations', () => {
      list.append(1).append(2).append(3);

      const strings = list.map((x) => `num: ${x}`);

      expect(strings).toEqual(['num: 1', 'num: 2', 'num: 3']);
    });
  });

  describe('filter()', () => {
    it('should filter elements based on predicate', () => {
      list.append(1).append(2).append(3).append(4).append(5);

      const evens = list.filter((x) => x % 2 === 0);

      expect(evens).toEqual([2, 4]);

      // Original list should be unchanged
      expect(list.size).toBe(5);
    });

    it('should handle index parameter', () => {
      list.append(10).append(20).append(30).append(40);

      const result = list.filter((_, idx) => idx % 2 === 0);

      expect(result).toEqual([10, 30]);
    });

    it('should return empty array when no elements match', () => {
      list.append(1).append(3).append(5);

      const evens = list.filter((x) => x % 2 === 0);

      expect(evens).toEqual([]);
    });

    it('should return all elements when all match', () => {
      list.append(2).append(4).append(6);

      const evens = list.filter((x) => x % 2 === 0);

      expect(evens).toEqual([2, 4, 6]);
    });
  });

  describe('toArray()', () => {
    it('should convert list to array', () => {
      list.append(1).append(2).append(3);

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

    it('should format single element with circular indicator', () => {
      list.append(42);

      expect(list.toString()).toBe('[42 ⟲]');
    });

    it('should format multiple elements with circular indicator', () => {
      list.append(1).append(2).append(3);

      expect(list.toString()).toBe('[1 ↔ 2 ↔ 3 ⟲]');
    });

    it('should handle different types', () => {
      const stringList = new CircularDoublyLinkedList<string>();

      stringList.append('hello').append('world');

      expect(stringList.toString()).toBe('[hello ↔ world ⟲]');
    });
  });

  describe('Iterator', () => {
    it('should work with for...of loop', () => {
      list.append(1).append(2).append(3);

      const values: number[] = [];
      for (const val of list) {
        values.push(val);
      }

      expect(values).toEqual([1, 2, 3]);
    });

    it('should work with spread operator', () => {
      list.append(1).append(2).append(3);

      const values = [...list];

      expect(values).toEqual([1, 2, 3]);
    });

    it('should handle empty list', () => {
      const values = [...list];

      expect(values).toEqual([]);
    });

    it('should not iterate infinitely', () => {
      list.append(1).append(2).append(3);

      let count = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of list) {
        count++;
        if (count > 10) break; // Safety check
      }

      expect(count).toBe(3); // Should iterate exactly 3 times
    });
  });

  describe('Generic Types', () => {
    it('should work with strings', () => {
      const stringList = new CircularDoublyLinkedList<string>();

      stringList.append('a').append('b').append('c');

      expect(stringList.toString()).toBe('[a ↔ b ↔ c ⟲]');
      expect(stringList.contains('b')).toBe(true);
    });

    it('should work with objects', () => {
      interface Person {
        name: string;
        age: number;
      }

      const personList = new CircularDoublyLinkedList<Person>();

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

    it('should maintain circular structure through operations', () => {
      list.append(1).append(2).append(3);
      list.removeFirst();
      list.append(4);
      list.rotate(1);

      expect(list.getFirst()).toBe(3);
      expect(list.getLast()).toBe(2);
    });

    it('should handle complex operation sequences', () => {
      list.append(1).append(2).append(3);
      list.rotate(1);
      list.insertAt(1, 1.5);
      list.removeAt(0);
      list.reverse();
      list.set(0, 100);

      expect(list.size).toBe(3);
      expect(list.getFirst()).toBe(100);
    });

    it('should handle rotation combined with other operations', () => {
      list.append(1).append(2).append(3).append(4);
      list.rotate(2);
      list.reverse();

      expect(list.toArray()).toEqual([2, 1, 4, 3]);
    });
  });
});
