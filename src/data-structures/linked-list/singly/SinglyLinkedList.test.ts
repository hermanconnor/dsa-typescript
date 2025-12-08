import { describe, it, expect, beforeEach } from 'vitest';
import SinglyLinkedList from './SinglyLinkedList';

describe('SinglyLinkedList', () => {
  let list: SinglyLinkedList<number>;

  beforeEach(() => {
    list = new SinglyLinkedList<number>();
  });

  describe('constructor', () => {
    it('should create an empty list', () => {
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('push', () => {
    it('should add a node to an empty list', () => {
      list.push(1);

      expect(list.head?.val).toBe(1);
      expect(list.tail?.val).toBe(1);
      expect(list.length).toBe(1);
    });

    it('should add multiple nodes to the end', () => {
      list.push(1).push(2).push(3);

      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.length).toBe(3);
      expect(list.head?.val).toBe(1);
      expect(list.tail?.val).toBe(3);
    });

    it('should support method chaining', () => {
      const result = list.push(1).push(2).push(3);

      expect(result).toBe(list);
    });
  });

  describe('pop', () => {
    it('should return undefined for an empty list', () => {
      expect(list.pop()).toBeUndefined();
    });

    it('should remove and return the last node from a single-node list', () => {
      list.push(1);

      expect(list.pop()).toBe(1);
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
    });

    it('should remove and return the last node from a multi-node list', () => {
      list.push(1).push(2).push(3);

      expect(list.pop()).toBe(3);
      expect(list.toArray()).toEqual([1, 2]);
      expect(list.length).toBe(2);
      expect(list.tail?.val).toBe(2);
    });

    it('should handle popping all nodes', () => {
      list.push(1).push(2);

      expect(list.pop()).toBe(2);
      expect(list.pop()).toBe(1);
      expect(list.pop()).toBeUndefined();
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('unshift', () => {
    it('should add a node to an empty list', () => {
      list.unshift(1);

      expect(list.head?.val).toBe(1);
      expect(list.tail?.val).toBe(1);
      expect(list.length).toBe(1);
    });

    it('should add multiple nodes to the beginning', () => {
      list.unshift(3).unshift(2).unshift(1);

      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.length).toBe(3);
      expect(list.head?.val).toBe(1);
      expect(list.tail?.val).toBe(3);
    });

    it('should support method chaining', () => {
      const result = list.unshift(1).unshift(2);

      expect(result).toBe(list);
    });
  });

  describe('shift', () => {
    it('should return undefined for an empty list', () => {
      expect(list.shift()).toBeUndefined();
    });

    it('should remove and return the first node from a single-node list', () => {
      list.push(1);

      expect(list.shift()).toBe(1);
      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
    });

    it('should remove and return the first node from a multi-node list', () => {
      list.push(1).push(2).push(3);

      expect(list.shift()).toBe(1);
      expect(list.toArray()).toEqual([2, 3]);
      expect(list.length).toBe(2);
      expect(list.head?.val).toBe(2);
    });

    it('should handle shifting all nodes', () => {
      list.push(1).push(2);

      expect(list.shift()).toBe(1);
      expect(list.shift()).toBe(2);
      expect(list.shift()).toBeUndefined();
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      list.push(10).push(20).push(30).push(40);
    });

    it('should return null for negative index', () => {
      expect(list.get(-1)).toBeNull();
    });

    it('should return null for index >= length', () => {
      expect(list.get(4)).toBeNull();
      expect(list.get(100)).toBeNull();
    });

    it('should return the correct node at valid indices', () => {
      expect(list.get(0)?.val).toBe(10);
      expect(list.get(1)?.val).toBe(20);
      expect(list.get(2)?.val).toBe(30);
      expect(list.get(3)?.val).toBe(40);
    });

    it('should return null for empty list', () => {
      const emptyList = new SinglyLinkedList<number>();

      expect(emptyList.get(0)).toBeNull();
    });
  });

  describe('set', () => {
    beforeEach(() => {
      list.push(10).push(20).push(30);
    });

    it('should return false for invalid index', () => {
      expect(list.set(-1, 999)).toBe(false);
      expect(list.set(3, 999)).toBe(false);
    });

    it('should update value at valid index and return true', () => {
      expect(list.set(1, 999)).toBe(true);
      expect(list.toArray()).toEqual([10, 999, 30]);
    });

    it('should update first and last nodes', () => {
      expect(list.set(0, 1)).toBe(true);
      expect(list.set(2, 3)).toBe(true);
      expect(list.toArray()).toEqual([1, 20, 3]);
    });
  });

  describe('insert', () => {
    it('should return false for negative index', () => {
      expect(list.insert(-1, 999)).toBe(false);
    });

    it('should return false for index > length', () => {
      list.push(1);

      expect(list.insert(2, 999)).toBe(false);
    });

    it('should insert at the beginning (index 0)', () => {
      list.push(2).push(3);

      expect(list.insert(0, 1)).toBe(true);
      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.head?.val).toBe(1);
    });

    it('should insert at the end (index === length)', () => {
      list.push(1).push(2);

      expect(list.insert(2, 3)).toBe(true);
      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.tail?.val).toBe(3);
    });

    it('should insert in the middle', () => {
      list.push(1).push(3);

      expect(list.insert(1, 2)).toBe(true);
      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.length).toBe(3);
    });

    it('should insert into an empty list', () => {
      expect(list.insert(0, 1)).toBe(true);
      expect(list.toArray()).toEqual([1]);
      expect(list.head?.val).toBe(1);
      expect(list.tail?.val).toBe(1);
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      list.push(1).push(2).push(3).push(4);
    });

    it('should return undefined for invalid index', () => {
      expect(list.remove(-1)).toBeUndefined();
      expect(list.remove(4)).toBeUndefined();
    });

    it('should remove from the beginning (index 0)', () => {
      expect(list.remove(0)).toBe(1);
      expect(list.toArray()).toEqual([2, 3, 4]);
      expect(list.length).toBe(3);
    });

    it('should remove from the end (index === length - 1)', () => {
      expect(list.remove(3)).toBe(4);
      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.length).toBe(3);
    });

    it('should remove from the middle', () => {
      expect(list.remove(2)).toBe(3);
      expect(list.toArray()).toEqual([1, 2, 4]);
      expect(list.length).toBe(3);
    });

    it('should handle removing from single-node list', () => {
      const singleList = new SinglyLinkedList<number>();

      singleList.push(1);

      expect(singleList.remove(0)).toBe(1);
      expect(singleList.isEmpty()).toBe(true);
    });
  });

  describe('reverse', () => {
    it('should handle empty list', () => {
      list.reverse();

      expect(list.toArray()).toEqual([]);
      expect(list.isEmpty()).toBe(true);
    });

    it('should handle single-node list', () => {
      list.push(1);
      list.reverse();

      expect(list.toArray()).toEqual([1]);
      expect(list.head?.val).toBe(1);
      expect(list.tail?.val).toBe(1);
    });

    it('should reverse a multi-node list', () => {
      list.push(1).push(2).push(3).push(4).push(5);
      list.reverse();

      expect(list.toArray()).toEqual([5, 4, 3, 2, 1]);
      expect(list.head?.val).toBe(5);
      expect(list.tail?.val).toBe(1);
      expect(list.length).toBe(5);
    });

    it('should support method chaining', () => {
      const result = list.push(1).push(2).reverse();

      expect(result).toBe(list);
    });

    it('should reverse correctly twice', () => {
      list.push(1).push(2).push(3);
      list.reverse().reverse();

      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty list', () => {
      expect(list.isEmpty()).toBe(true);
    });

    it('should return false for non-empty list', () => {
      list.push(1);

      expect(list.isEmpty()).toBe(false);
    });
  });

  describe('clear', () => {
    it('should clear an empty list', () => {
      list.clear();

      expect(list.isEmpty()).toBe(true);
    });

    it('should clear a non-empty list', () => {
      list.push(1).push(2).push(3);
      list.clear();

      expect(list.head).toBeNull();
      expect(list.tail).toBeNull();
      expect(list.length).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty list', () => {
      expect(list.toArray()).toEqual([]);
    });

    it('should return array with all values', () => {
      list.push(1).push(2).push(3);

      expect(list.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('toString', () => {
    it('should return "null" for empty list', () => {
      expect(list.toString()).toBe('null');
    });

    it('should format single-node list', () => {
      list.push(1);

      expect(list.toString()).toBe('1 -> null');
    });

    it('should format multi-node list with default separator', () => {
      list.push(1).push(2).push(3);
      expect(list.toString()).toBe('1 -> 2 -> 3 -> null');
    });

    it('should use custom separator', () => {
      list.push(1).push(2).push(3);

      expect(list.toString(' | ')).toBe('1 | 2 | 3 -> null');
    });
  });

  describe('find', () => {
    beforeEach(() => {
      list.push(10).push(20).push(30).push(40);
    });

    it('should return undefined for empty list', () => {
      const emptyList = new SinglyLinkedList<number>();

      expect(emptyList.find((x) => x > 5)).toBeUndefined();
    });

    it('should find value that matches predicate', () => {
      expect(list.find((x) => x > 25)).toBe(30);
    });

    it('should return first matching value', () => {
      expect(list.find((x) => x > 15)).toBe(20);
    });

    it('should return undefined if no match', () => {
      expect(list.find((x) => x > 100)).toBeUndefined();
    });
  });

  describe('forEach', () => {
    it('should not execute callback for empty list', () => {
      let count = 0;

      list.forEach(() => count++);

      expect(count).toBe(0);
    });

    it('should execute callback for each element', () => {
      list.push(1).push(2).push(3);

      const values: number[] = [];
      const indices: number[] = [];

      list.forEach((val, idx) => {
        values.push(val);
        indices.push(idx);
      });

      expect(values).toEqual([1, 2, 3]);
      expect(indices).toEqual([0, 1, 2]);
    });
  });

  describe('Symbol.iterator', () => {
    it('should iterate over empty list', () => {
      const values = [...list];

      expect(values).toEqual([]);
    });

    it('should iterate over all values', () => {
      list.push(1).push(2).push(3);

      const values = [...list];

      expect(values).toEqual([1, 2, 3]);
    });

    it('should work with for...of loop', () => {
      list.push(10).push(20).push(30);
      const values: number[] = [];

      for (const val of list) {
        values.push(val);
      }

      expect(values).toEqual([10, 20, 30]);
    });
  });

  describe('generic type support', () => {
    it('should work with strings', () => {
      const stringList = new SinglyLinkedList<string>();

      stringList.push('a').push('b').push('c');

      expect(stringList.toArray()).toEqual(['a', 'b', 'c']);
      expect(stringList.toString()).toBe('a -> b -> c -> null');
    });

    it('should work with objects', () => {
      interface Person {
        name: string;
        age: number;
      }

      const personList = new SinglyLinkedList<Person>();

      personList.push({ name: 'Alice', age: 30 });
      personList.push({ name: 'Bob', age: 25 });

      expect(personList.length).toBe(2);
      expect(personList.get(0)?.val.name).toBe('Alice');
      expect(personList.find((p) => p.age === 25)?.name).toBe('Bob');
    });
  });
});
