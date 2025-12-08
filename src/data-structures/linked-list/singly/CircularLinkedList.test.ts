import { describe, it, expect, beforeEach } from 'vitest';
import CircularLinkedList from './CircularLinkedList';

describe('CircularLinkedList', () => {
  let list: CircularLinkedList<number>;

  beforeEach(() => {
    list = new CircularLinkedList<number>();
  });

  describe('constructor', () => {
    it('should create an empty list', () => {
      expect(list.size).toBe(0);
      expect(list.head).toBeNull();
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('append', () => {
    it('should add a node to an empty list', () => {
      list.append(1);

      expect(list.size).toBe(1);
      expect(list.head?.value).toBe(1);
      expect(list.toArray()).toEqual([1]);
    });

    it('should add multiple nodes to the end', () => {
      list.append(1).append(2).append(3);

      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.size).toBe(3);
    });

    it('should maintain circular structure', () => {
      list.append(1).append(2);

      const head = list.head;
      // In a 2-node circular list: head -> node2 -> head
      expect(head?.next.next).toBe(head); // After 2 steps, back to head
    });

    it('should support method chaining', () => {
      const result = list.append(1).append(2).append(3);

      expect(result).toBe(list);
    });
  });

  describe('prepend', () => {
    it('should add a node to an empty list', () => {
      list.prepend(1);

      expect(list.size).toBe(1);
      expect(list.head?.value).toBe(1);
    });

    it('should add multiple nodes to the beginning', () => {
      list.prepend(3).prepend(2).prepend(1);

      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.size).toBe(3);
    });

    it('should maintain circular structure', () => {
      list.prepend(1).prepend(2);

      const head = list.head;
      // In a 2-node circular list: head -> node2 -> head
      expect(head?.next.next).toBe(head);
    });

    it('should support method chaining', () => {
      const result = list.prepend(1).prepend(2);

      expect(result).toBe(list);
    });
  });

  describe('insertAt', () => {
    it('should return false for negative index', () => {
      expect(list.insertAt(-1, 999)).toBe(false);
    });

    it('should return false for index > size', () => {
      list.append(1);

      expect(list.insertAt(2, 999)).toBe(false);
    });

    it('should insert at the beginning (index 0)', () => {
      list.append(2).append(3);

      expect(list.insertAt(0, 1)).toBe(true);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('should insert at the end (index === size)', () => {
      list.append(1).append(2);

      expect(list.insertAt(2, 3)).toBe(true);
      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('should insert in the middle', () => {
      list.append(1).append(3);

      expect(list.insertAt(1, 2)).toBe(true);
      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.size).toBe(3);
    });

    it('should insert into an empty list', () => {
      expect(list.insertAt(0, 1)).toBe(true);
      expect(list.toArray()).toEqual([1]);
    });

    it('should maintain circular structure after insert', () => {
      list.append(1).append(3);
      list.insertAt(1, 2);

      const head = list.head;
      let curr = head;
      let count = 0;
      do {
        curr = curr!.next;
        count++;
      } while (curr !== head && count < 10);

      expect(count).toBe(3); // Should loop back after 3 nodes
    });
  });

  describe('removeFirst', () => {
    it('should return undefined for an empty list', () => {
      expect(list.removeFirst()).toBeUndefined();
    });

    it('should remove and return the first node from a single-node list', () => {
      list.append(1);

      expect(list.removeFirst()).toBe(1);
      expect(list.size).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });

    it('should remove and return the first node from a multi-node list', () => {
      list.append(1).append(2).append(3);

      expect(list.removeFirst()).toBe(1);
      expect(list.toArray()).toEqual([2, 3]);
      expect(list.size).toBe(2);
      expect(list.head?.value).toBe(2);
    });

    it('should maintain circular structure after removal', () => {
      list.append(1).append(2).append(3);
      list.removeFirst();

      const head = list.head;
      // After removing first, we have 2 nodes: head -> node2 -> head
      expect(head?.next.next).toBe(head);
    });
  });

  describe('removeLast', () => {
    it('should return undefined for an empty list', () => {
      expect(list.removeLast()).toBeUndefined();
    });

    it('should remove and return the last node from a single-node list', () => {
      list.append(1);

      expect(list.removeLast()).toBe(1);
      expect(list.size).toBe(0);
      expect(list.isEmpty()).toBe(true);
    });

    it('should remove and return the last node from a multi-node list', () => {
      list.append(1).append(2).append(3);

      expect(list.removeLast()).toBe(3);
      expect(list.toArray()).toEqual([1, 2]);
      expect(list.size).toBe(2);
    });

    it('should maintain circular structure after removal', () => {
      list.append(1).append(2).append(3);
      list.removeLast();

      const head = list.head;
      // After removing last, we have 2 nodes: head -> node2 -> head
      expect(head?.next.next).toBe(head);
    });
  });

  describe('removeAt', () => {
    beforeEach(() => {
      list.append(1).append(2).append(3).append(4);
    });

    it('should return undefined for invalid index', () => {
      expect(list.removeAt(-1)).toBeUndefined();
      expect(list.removeAt(4)).toBeUndefined();
    });

    it('should remove from the beginning (index 0)', () => {
      expect(list.removeAt(0)).toBe(1);
      expect(list.toArray()).toEqual([2, 3, 4]);
      expect(list.size).toBe(3);
    });

    it('should remove from the end (index === size - 1)', () => {
      expect(list.removeAt(3)).toBe(4);
      expect(list.toArray()).toEqual([1, 2, 3]);
      expect(list.size).toBe(3);
    });

    it('should remove from the middle', () => {
      expect(list.removeAt(2)).toBe(3);
      expect(list.toArray()).toEqual([1, 2, 4]);
      expect(list.size).toBe(3);
    });

    it('should return undefined for empty list', () => {
      const emptyList = new CircularLinkedList<number>();

      expect(emptyList.removeAt(0)).toBeUndefined();
    });
  });

  describe('find', () => {
    beforeEach(() => {
      list.append(10).append(20).append(30).append(40);
    });

    it('should return null for empty list', () => {
      const emptyList = new CircularLinkedList<number>();

      expect(emptyList.find(5)).toBeNull();
    });

    it('should find existing value', () => {
      const node = list.find(30);

      expect(node).not.toBeNull();
      expect(node?.value).toBe(30);
    });

    it('should return null for non-existent value', () => {
      expect(list.find(999)).toBeNull();
    });

    it('should find first node', () => {
      const node = list.find(10);

      expect(node).toBe(list.head);
    });
  });

  describe('contains', () => {
    beforeEach(() => {
      list.append(10).append(20).append(30);
    });

    it('should return false for empty list', () => {
      const emptyList = new CircularLinkedList<number>();

      expect(emptyList.contains(5)).toBe(false);
    });

    it('should return true for existing value', () => {
      expect(list.contains(20)).toBe(true);
    });

    it('should return false for non-existent value', () => {
      expect(list.contains(999)).toBe(false);
    });
  });

  describe('get', () => {
    beforeEach(() => {
      list.append(10).append(20).append(30).append(40);
    });

    it('should return undefined for negative index', () => {
      expect(list.get(-1)).toBeUndefined();
    });

    it('should return undefined for index >= size', () => {
      expect(list.get(4)).toBeUndefined();
    });

    it('should return correct value at valid indices', () => {
      expect(list.get(0)).toBe(10);
      expect(list.get(1)).toBe(20);
      expect(list.get(2)).toBe(30);
      expect(list.get(3)).toBe(40);
    });

    it('should return undefined for empty list', () => {
      const emptyList = new CircularLinkedList<number>();

      expect(emptyList.get(0)).toBeUndefined();
    });
  });

  describe('set', () => {
    beforeEach(() => {
      list.append(10).append(20).append(30);
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

    it('should return false for empty list', () => {
      const emptyList = new CircularLinkedList<number>();

      expect(emptyList.set(0, 1)).toBe(false);
    });
  });

  describe('indexOf', () => {
    beforeEach(() => {
      list.append(10).append(20).append(30).append(20);
    });

    it('should return -1 for empty list', () => {
      const emptyList = new CircularLinkedList<number>();

      expect(emptyList.indexOf(5)).toBe(-1);
    });

    it('should return index of existing value', () => {
      expect(list.indexOf(30)).toBe(2);
    });

    it('should return first occurrence index', () => {
      expect(list.indexOf(20)).toBe(1); // Not 3
    });

    it('should return -1 for non-existent value', () => {
      expect(list.indexOf(999)).toBe(-1);
    });

    it('should return 0 for first element', () => {
      expect(list.indexOf(10)).toBe(0);
    });
  });

  describe('rotate', () => {
    beforeEach(() => {
      list.append(1).append(2).append(3).append(4).append(5);
    });

    it('should handle empty list', () => {
      const emptyList = new CircularLinkedList<number>();

      emptyList.rotate(3);

      expect(emptyList.toArray()).toEqual([]);
    });

    it('should handle single-node list', () => {
      const singleList = new CircularLinkedList<number>();

      singleList.append(1);
      singleList.rotate(5);

      expect(singleList.toArray()).toEqual([1]);
    });

    it('should rotate forward by positive k', () => {
      list.rotate(2);

      expect(list.toArray()).toEqual([3, 4, 5, 1, 2]);
    });

    it('should rotate backward by negative k', () => {
      list.rotate(-2);

      expect(list.toArray()).toEqual([4, 5, 1, 2, 3]);
    });

    it('should handle k === 0', () => {
      const original = list.toArray();

      list.rotate(0);

      expect(list.toArray()).toEqual(original);
    });

    it('should handle k === size (full rotation)', () => {
      const original = list.toArray();

      list.rotate(5);

      expect(list.toArray()).toEqual(original);
    });

    it('should handle k > size', () => {
      list.rotate(7); // 7 % 5 = 2

      expect(list.toArray()).toEqual([3, 4, 5, 1, 2]);
    });

    it('should support method chaining', () => {
      const result = list.rotate(1);

      expect(result).toBe(list);
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty list', () => {
      expect(list.toArray()).toEqual([]);
    });

    it('should return array with all values', () => {
      list.append(1).append(2).append(3);

      expect(list.toArray()).toEqual([1, 2, 3]);
    });

    it('should return array in correct order', () => {
      list.append(5).prepend(3).append(7).prepend(1);

      expect(list.toArray()).toEqual([1, 3, 5, 7]);
    });
  });

  describe('toString', () => {
    it('should return "[]" for empty list', () => {
      expect(list.toString()).toBe('[]');
    });

    it('should format single-node list', () => {
      list.append(1);

      expect(list.toString()).toBe('[1] -> (circular)');
    });

    it('should format multi-node list with default separator', () => {
      list.append(1).append(2).append(3);

      expect(list.toString()).toBe('[1 -> 2 -> 3] -> (circular)');
    });

    it('should use custom separator', () => {
      list.append(1).append(2).append(3);

      expect(list.toString(' | ')).toBe('[1 | 2 | 3] -> (circular)');
    });
  });

  describe('forEach', () => {
    it('should not execute callback for empty list', () => {
      let count = 0;
      list.forEach(() => count++);

      expect(count).toBe(0);
    });

    it('should execute callback for each element', () => {
      list.append(1).append(2).append(3);
      const values: number[] = [];
      const indices: number[] = [];

      list.forEach((value, index) => {
        values.push(value);
        indices.push(index);
      });

      expect(values).toEqual([1, 2, 3]);
      expect(indices).toEqual([0, 1, 2]);
    });

    it('should not loop infinitely', () => {
      list.append(1).append(2).append(3);
      let count = 0;
      list.forEach(() => count++);

      expect(count).toBe(3); // Should execute exactly 3 times
    });
  });

  describe('map', () => {
    it('should return empty list for empty list', () => {
      const mapped = list.map((x) => x * 2);

      expect(mapped.toArray()).toEqual([]);
    });

    it('should transform all values', () => {
      list.append(1).append(2).append(3);

      const mapped = list.map((x) => x * 2);

      expect(mapped.toArray()).toEqual([2, 4, 6]);
    });

    it('should pass index to callback', () => {
      list.append(10).append(20).append(30);

      const mapped = list.map((x, i) => x + i);

      expect(mapped.toArray()).toEqual([10, 21, 32]);
    });

    it('should support type transformation', () => {
      list.append(1).append(2).append(3);

      const mapped = list.map((x) => `num${x}`);

      expect(mapped.toArray()).toEqual(['num1', 'num2', 'num3']);
    });
  });

  describe('filter', () => {
    beforeEach(() => {
      list.append(1).append(2).append(3).append(4).append(5);
    });

    it('should return empty list for empty list', () => {
      const emptyList = new CircularLinkedList<number>();
      const filtered = emptyList.filter((x) => x > 0);

      expect(filtered.toArray()).toEqual([]);
    });

    it('should filter values based on predicate', () => {
      const filtered = list.filter((x) => x > 3);

      expect(filtered.toArray()).toEqual([4, 5]);
    });

    it('should return all values if all match', () => {
      const filtered = list.filter((x) => x > 0);

      expect(filtered.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should return empty list if none match', () => {
      const filtered = list.filter((x) => x > 10);

      expect(filtered.toArray()).toEqual([]);
    });

    it('should pass index to predicate', () => {
      const filtered = list.filter((_, i) => i % 2 === 0);

      expect(filtered.toArray()).toEqual([1, 3, 5]);
    });
  });

  describe('reduce', () => {
    beforeEach(() => {
      list.append(1).append(2).append(3).append(4);
    });

    it('should reduce to initial value for empty list', () => {
      const emptyList = new CircularLinkedList<number>();
      const sum = emptyList.reduce((acc, val) => acc + val, 0);

      expect(sum).toBe(0);
    });

    it('should sum all values', () => {
      const sum = list.reduce((acc, val) => acc + val, 0);

      expect(sum).toBe(10);
    });

    it('should work with different accumulator type', () => {
      const str = list.reduce((acc, val) => acc + val.toString(), '');

      expect(str).toBe('1234');
    });

    it('should pass index to callback', () => {
      const result = list.reduce((acc, val, i) => acc + val * i, 0);

      expect(result).toBe(0 * 1 + 1 * 2 + 2 * 3 + 3 * 4); // 20
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty list', () => {
      expect(list.isEmpty()).toBe(true);
    });

    it('should return false for non-empty list', () => {
      list.append(1);

      expect(list.isEmpty()).toBe(false);
    });

    it('should return true after clearing', () => {
      list.append(1).append(2);
      list.clear();

      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear an empty list', () => {
      list.clear();

      expect(list.isEmpty()).toBe(true);
      expect(list.size).toBe(0);
    });

    it('should clear a non-empty list', () => {
      list.append(1).append(2).append(3);
      list.clear();

      expect(list.size).toBe(0);
      expect(list.head).toBeNull();
      expect(list.isEmpty()).toBe(true);
    });
  });

  describe('Symbol.iterator', () => {
    it('should iterate over empty list', () => {
      const values = [...list];

      expect(values).toEqual([]);
    });

    it('should iterate over all values', () => {
      list.append(1).append(2).append(3);

      const values = [...list];

      expect(values).toEqual([1, 2, 3]);
    });

    it('should work with for...of loop', () => {
      list.append(10).append(20).append(30);
      const values: number[] = [];

      for (const val of list) {
        values.push(val);
      }

      expect(values).toEqual([10, 20, 30]);
    });

    it('should not loop infinitely', () => {
      list.append(1).append(2).append(3);
      let count = 0;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const _ of list) {
        count++;
        if (count > 10) break; // Safety check
      }

      expect(count).toBe(3);
    });
  });

  describe('aliases', () => {
    it('push should work like append', () => {
      list.push(1).push(2);
      expect(list.toArray()).toEqual([1, 2]);
    });

    it('unshift should work like prepend', () => {
      list.unshift(2).unshift(1);
      expect(list.toArray()).toEqual([1, 2]);
    });

    it('shift should work like removeFirst', () => {
      list.append(1).append(2);

      expect(list.shift()).toBe(1);
      expect(list.toArray()).toEqual([2]);
    });

    it('pop should work like removeLast', () => {
      list.append(1).append(2);

      expect(list.pop()).toBe(2);
      expect(list.toArray()).toEqual([1]);
    });
  });

  describe('circular structure integrity', () => {
    it('should maintain circularity after multiple operations', () => {
      list.append(1).append(2).append(3);
      list.removeFirst();
      list.append(4);
      list.prepend(0);

      // Verify circular structure
      const head = list.head;
      let curr = head;
      let count = 0;
      const maxIterations = list.size + 1;

      do {
        curr = curr!.next;
        count++;
      } while (curr !== head && count < maxIterations);

      expect(count).toBe(list.size);
      expect(curr).toBe(head);
    });

    it('should handle edge case of alternating add/remove', () => {
      list.append(1);
      expect(list.size).toBe(1);
      list.removeFirst();
      expect(list.size).toBe(0);
      list.append(2);
      expect(list.size).toBe(1);
      expect(list.toArray()).toEqual([2]);
    });
  });

  describe('generic type support', () => {
    it('should work with strings', () => {
      const stringList = new CircularLinkedList<string>();

      stringList.append('a').append('b').append('c');

      expect(stringList.toArray()).toEqual(['a', 'b', 'c']);
      expect(stringList.toString()).toBe('[a -> b -> c] -> (circular)');
    });

    it('should work with objects', () => {
      interface Person {
        name: string;
        age: number;
      }

      const personList = new CircularLinkedList<Person>();

      const alice = { name: 'Alice', age: 30 };
      const bob = { name: 'Bob', age: 25 };

      personList.append(alice);
      personList.append(bob);

      expect(personList.size).toBe(2);
      expect(personList.get(0)?.name).toBe('Alice');

      // Use contains to check if the exact object reference exists
      expect(personList.contains(bob)).toBe(true);

      // find() uses === comparison, so it needs the exact reference
      const foundBob = personList.find(bob);

      expect(foundBob).not.toBeNull();
      expect(foundBob?.value.name).toBe('Bob');
    });
  });
});
