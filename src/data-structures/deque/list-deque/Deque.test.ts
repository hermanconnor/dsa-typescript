import { describe, expect, it, beforeEach } from 'vitest';
import Deque from './Deque';

describe('Deque', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  describe('Constructor', () => {
    it('should create an empty deque', () => {
      expect(deque.isEmpty()).toBe(true);
      expect(deque.size()).toBe(0);
      expect(deque.length).toBe(0);
    });

    it('should create a deque from an iterable', () => {
      deque = new Deque([1, 2, 3, 4]);

      expect(deque.size()).toBe(4);
      expect(deque.toArray()).toEqual([1, 2, 3, 4]);
    });

    it('should create a deque with maxlen', () => {
      deque = new Deque<number>(3);

      expect(deque.getMaxLen()).toBe(3);
      expect(deque.isEmpty()).toBe(true);
    });

    it('should create a deque from iterable with maxlen', () => {
      deque = new Deque([1, 2, 3, 4, 5], 3);

      expect(deque.size()).toBe(3);
      expect(deque.toArray()).toEqual([3, 4, 5]); // Keeps last 3
    });

    it('should throw error for invalid maxlen', () => {
      expect(() => new Deque<number>(0)).toThrow(
        'maxlen must be greater than 0',
      );

      expect(() => new Deque<number>(-1)).toThrow(
        'maxlen must be greater than 0',
      );
    });

    it('should handle empty iterable with maxlen', () => {
      deque = new Deque([], 3);

      expect(deque.isEmpty()).toBe(true);
      expect(deque.getMaxLen()).toBe(3);
    });
  });

  describe('addFront', () => {
    it('should add element to empty deque', () => {
      deque.addFront(1);

      expect(deque.peekFront()).toBe(1);
      expect(deque.peekRear()).toBe(1);
      expect(deque.size()).toBe(1);
    });

    it('should add multiple elements to front', () => {
      deque.addFront(1);
      deque.addFront(2);
      deque.addFront(3);

      expect(deque.toArray()).toEqual([3, 2, 1]);
    });

    it('should respect maxlen by removing from rear', () => {
      deque = new Deque<number>(3);

      deque.addFront(1);
      deque.addFront(2);
      deque.addFront(3);
      deque.addFront(4); // Should remove 1 from rear

      expect(deque.toArray()).toEqual([4, 3, 2]);
      expect(deque.size()).toBe(3);
    });
  });

  describe('addRear', () => {
    it('should add element to empty deque', () => {
      deque.addRear(1);

      expect(deque.peekFront()).toBe(1);
      expect(deque.peekRear()).toBe(1);
      expect(deque.size()).toBe(1);
    });

    it('should add multiple elements to rear', () => {
      deque.addRear(1);
      deque.addRear(2);
      deque.addRear(3);

      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    it('should respect maxlen by removing from front', () => {
      deque = new Deque<number>(3);

      deque.addRear(1);
      deque.addRear(2);
      deque.addRear(3);
      deque.addRear(4); // Should remove 1 from front

      expect(deque.toArray()).toEqual([2, 3, 4]);
      expect(deque.size()).toBe(3);
    });
  });

  describe('removeFront', () => {
    it('should return undefined for empty deque', () => {
      expect(deque.removeFront()).toBeUndefined();
    });

    it('should remove and return front element', () => {
      deque = new Deque([1, 2, 3]);

      expect(deque.removeFront()).toBe(1);
      expect(deque.toArray()).toEqual([2, 3]);
      expect(deque.size()).toBe(2);
    });

    it('should handle removing from single-element deque', () => {
      deque = new Deque([1]);

      expect(deque.removeFront()).toBe(1);
      expect(deque.isEmpty()).toBe(true);
      expect(deque.peekFront()).toBeUndefined();
      expect(deque.peekRear()).toBeUndefined();
    });

    it('should remove all elements sequentially', () => {
      deque = new Deque([1, 2, 3]);

      expect(deque.removeFront()).toBe(1);
      expect(deque.removeFront()).toBe(2);
      expect(deque.removeFront()).toBe(3);
      expect(deque.isEmpty()).toBe(true);
    });
  });

  describe('removeRear', () => {
    it('should return undefined for empty deque', () => {
      expect(deque.removeRear()).toBeUndefined();
    });

    it('should remove and return rear element', () => {
      deque = new Deque([1, 2, 3]);

      expect(deque.removeRear()).toBe(3);
      expect(deque.toArray()).toEqual([1, 2]);
      expect(deque.size()).toBe(2);
    });

    it('should handle removing from single-element deque', () => {
      deque = new Deque([1]);

      expect(deque.removeRear()).toBe(1);
      expect(deque.isEmpty()).toBe(true);
      expect(deque.peekFront()).toBeUndefined();
      expect(deque.peekRear()).toBeUndefined();
    });

    it('should remove all elements sequentially', () => {
      deque = new Deque([1, 2, 3]);

      expect(deque.removeRear()).toBe(3);
      expect(deque.removeRear()).toBe(2);
      expect(deque.removeRear()).toBe(1);
      expect(deque.isEmpty()).toBe(true);
    });
  });

  describe('peekFront and peekRear', () => {
    it('should return undefined for empty deque', () => {
      expect(deque.peekFront()).toBeUndefined();
      expect(deque.peekRear()).toBeUndefined();
    });

    it('should return front and rear without removing', () => {
      deque = new Deque([1, 2, 3]);

      expect(deque.peekFront()).toBe(1);
      expect(deque.peekRear()).toBe(3);
      expect(deque.size()).toBe(3); // Size unchanged
    });

    it('should return same value for single-element deque', () => {
      deque = new Deque([42]);

      expect(deque.peekFront()).toBe(42);
      expect(deque.peekRear()).toBe(42);
    });
  });

  describe('contains', () => {
    it('should return false for empty deque', () => {
      expect(deque.contains(1)).toBe(false);
    });

    it('should find existing elements', () => {
      deque = new Deque([1, 2, 3, 4, 5]);

      expect(deque.contains(1)).toBe(true);
      expect(deque.contains(3)).toBe(true);
      expect(deque.contains(5)).toBe(true);
    });

    it('should return false for non-existing elements', () => {
      deque = new Deque([1, 2, 3]);

      expect(deque.contains(4)).toBe(false);
      expect(deque.contains(0)).toBe(false);
    });

    it('should work with objects using strict equality', () => {
      const obj1 = { id: 1 };
      const obj2 = { id: 2 };
      const deque = new Deque([obj1, obj2]);

      expect(deque.contains(obj1)).toBe(true);
      expect(deque.contains({ id: 1 })).toBe(false); // Different reference
    });
  });

  describe('get', () => {
    it('should return undefined for empty deque', () => {
      expect(deque.get(0)).toBeUndefined();
    });

    it('should get elements by positive index', () => {
      deque = new Deque([10, 20, 30, 40, 50]);

      expect(deque.get(0)).toBe(10);
      expect(deque.get(2)).toBe(30);
      expect(deque.get(4)).toBe(50);
    });

    it('should get elements by negative index', () => {
      deque = new Deque([10, 20, 30, 40, 50]);

      expect(deque.get(-1)).toBe(50);
      expect(deque.get(-3)).toBe(30);
      expect(deque.get(-5)).toBe(10);
    });

    it('should return undefined for out of bounds', () => {
      deque = new Deque([1, 2, 3]);

      expect(deque.get(3)).toBeUndefined();
      expect(deque.get(-4)).toBeUndefined();
      expect(deque.get(100)).toBeUndefined();
    });
  });

  describe('extend', () => {
    it('should add multiple items to rear', () => {
      deque = new Deque([1, 2]);

      deque.extend([3, 4, 5]);

      expect(deque.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with empty deque', () => {
      deque.extend([1, 2, 3]);

      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    it('should respect maxlen', () => {
      deque = new Deque<number>([1, 2], 4);

      deque.extend([3, 4, 5, 6]);

      expect(deque.toArray()).toEqual([3, 4, 5, 6]); // First two removed
      expect(deque.size()).toBe(4);
    });

    it('should work with any iterable', () => {
      deque = new Deque([1]);

      deque.extend(new Set([2, 3, 4]));

      expect(deque.toArray()).toEqual([1, 2, 3, 4]);
    });
  });

  describe('extendLeft', () => {
    it('should add multiple items to front in order', () => {
      deque = new Deque([4, 5]);

      deque.extendLeft([1, 2, 3]);

      expect(deque.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with empty deque', () => {
      deque.extendLeft([1, 2, 3]);

      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    it('should respect maxlen', () => {
      deque = new Deque<number>([9, 10], 4);

      deque.extendLeft([5, 6, 7, 8]);

      expect(deque.toArray()).toEqual([5, 6, 7, 8]); // Last two removed
      expect(deque.size()).toBe(4);
    });

    it('should maintain correct order', () => {
      const deque = new Deque<string>();

      deque.extendLeft(['a', 'b', 'c']);

      expect(deque.peekFront()).toBe('a');
      expect(deque.peekRear()).toBe('c');
    });
  });

  describe('clear', () => {
    it('should clear empty deque', () => {
      deque.clear();

      expect(deque.isEmpty()).toBe(true);
    });

    it('should clear all elements', () => {
      deque = new Deque([1, 2, 3, 4, 5]);

      deque.clear();

      expect(deque.isEmpty()).toBe(true);
      expect(deque.size()).toBe(0);
      expect(deque.peekFront()).toBeUndefined();
      expect(deque.peekRear()).toBeUndefined();
    });

    it('should allow reuse after clear', () => {
      deque = new Deque([1, 2, 3]);

      deque.clear();
      deque.addRear(10);
      deque.addFront(5);

      expect(deque.toArray()).toEqual([5, 10]);
    });

    it('should preserve maxlen after clear', () => {
      deque = new Deque<number>([1, 2, 3], 3);

      deque.clear();
      expect(deque.getMaxLen()).toBe(3);

      deque.extend([1, 2, 3, 4]);
      expect(deque.size()).toBe(3);
    });
  });

  describe('rotate', () => {
    it('should do nothing for empty deque', () => {
      deque.rotate(5);

      expect(deque.isEmpty()).toBe(true);
    });

    it('should do nothing for single-element deque', () => {
      deque = new Deque([1]);

      deque.rotate(5);

      expect(deque.toArray()).toEqual([1]);
    });

    it('should rotate right (positive n)', () => {
      deque = new Deque([1, 2, 3, 4, 5]);

      deque.rotate(2);

      expect(deque.toArray()).toEqual([4, 5, 1, 2, 3]);
    });

    it('should rotate left (negative n)', () => {
      deque = new Deque([1, 2, 3, 4, 5]);

      deque.rotate(-2);

      expect(deque.toArray()).toEqual([3, 4, 5, 1, 2]);
    });

    it('should handle rotation greater than size', () => {
      deque = new Deque([1, 2, 3]);

      deque.rotate(5); // 5 % 3 = 2

      expect(deque.toArray()).toEqual([2, 3, 1]);
    });

    it('should handle default rotation of 1', () => {
      deque = new Deque([1, 2, 3]);

      deque.rotate();

      expect(deque.toArray()).toEqual([3, 1, 2]);
    });

    it('should handle zero rotation', () => {
      deque = new Deque([1, 2, 3]);

      deque.rotate(0);

      expect(deque.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('toString', () => {
    it('should return [EMPTY] for empty deque', () => {
      expect(deque.toString()).toBe('[EMPTY]');
    });

    it('should format single element', () => {
      deque = new Deque([42]);

      expect(deque.toString()).toBe('[FRONT] 42 [REAR]');
    });

    it('should format multiple elements', () => {
      deque = new Deque([1, 2, 3]);

      expect(deque.toString()).toBe('[FRONT] 1 <-> 2 <-> 3 [REAR]');
    });
  });

  describe('Iterator', () => {
    it('should iterate over empty deque', () => {
      const result = [...deque];

      expect(result).toEqual([]);
    });

    it('should iterate from front to rear', () => {
      deque = new Deque([1, 2, 3, 4]);

      const result = [...deque];

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should work with for...of loop', () => {
      deque = new Deque([10, 20, 30]);

      const result: number[] = [];
      for (const value of deque) {
        result.push(value);
      }

      expect(result).toEqual([10, 20, 30]);
    });
  });

  describe('reverseIterator', () => {
    it('should iterate over empty deque', () => {
      const result = [...deque.reverseIterator()];

      expect(result).toEqual([]);
    });

    it('should iterate from rear to front', () => {
      deque = new Deque([1, 2, 3, 4]);

      const result = [...deque.reverseIterator()];

      expect(result).toEqual([4, 3, 2, 1]);
    });

    it('should work with for...of loop', () => {
      const deque = new Deque(['a', 'b', 'c']);

      const result: string[] = [];
      for (const value of deque.reverseIterator()) {
        result.push(value);
      }

      expect(result).toEqual(['c', 'b', 'a']);
    });
  });

  describe('Integration Tests', () => {
    it('should work as a FIFO queue', () => {
      deque.addRear(1);
      deque.addRear(2);
      deque.addRear(3);

      expect(deque.removeFront()).toBe(1);
      expect(deque.removeFront()).toBe(2);
      expect(deque.removeFront()).toBe(3);
    });

    it('should work as a LIFO stack', () => {
      deque.addRear(1);
      deque.addRear(2);
      deque.addRear(3);

      expect(deque.removeRear()).toBe(3);
      expect(deque.removeRear()).toBe(2);
      expect(deque.removeRear()).toBe(1);
    });

    it('should handle mixed operations', () => {
      deque.addFront(2);
      deque.addRear(3);
      deque.addFront(1);
      deque.addRear(4);

      expect(deque.toArray()).toEqual([1, 2, 3, 4]);

      expect(deque.removeFront()).toBe(1);
      expect(deque.removeRear()).toBe(4);
      expect(deque.toArray()).toEqual([2, 3]);
    });

    it('should handle complex scenario with maxlen', () => {
      deque = new Deque<number>(3);

      deque.addRear(1);
      deque.addRear(2);
      deque.addRear(3);

      expect(deque.toArray()).toEqual([1, 2, 3]);

      deque.addRear(4); // Removes 1
      expect(deque.toArray()).toEqual([2, 3, 4]);

      deque.addFront(0); // Removes 4
      expect(deque.toArray()).toEqual([0, 2, 3]);

      deque.rotate(1);
      expect(deque.toArray()).toEqual([3, 0, 2]);
    });

    it('should handle large dataset', () => {
      const size = 10000;

      // Add elements
      for (let i = 0; i < size; i++) {
        deque.addRear(i);
      }

      expect(deque.size()).toBe(size);

      // Remove elements
      for (let i = 0; i < size; i++) {
        expect(deque.removeFront()).toBe(i);
      }

      expect(deque.isEmpty()).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle alternating add/remove operations', () => {
      deque.addFront(1);

      expect(deque.removeFront()).toBe(1);

      deque.addRear(2);

      expect(deque.removeRear()).toBe(2);
      expect(deque.isEmpty()).toBe(true);
    });

    it('should handle string values', () => {
      const deque = new Deque(['hello', 'world']);

      expect(deque.toArray()).toEqual(['hello', 'world']);
      expect(deque.contains('hello')).toBe(true);
    });

    it('should handle null and undefined values', () => {
      const deque = new Deque<number | null | undefined>([
        1,
        null,
        undefined,
        2,
      ]);

      expect(deque.size()).toBe(4);
      expect(deque.contains(null)).toBe(true);
      expect(deque.contains(undefined)).toBe(true);
      expect(deque.get(1)).toBeNull();
      expect(deque.get(2)).toBeUndefined();
    });

    it('should maintain correct state after multiple clears', () => {
      for (let i = 0; i < 3; i++) {
        deque.extend([1, 2, 3]);
        expect(deque.size()).toBe(3);
        deque.clear();
        expect(deque.isEmpty()).toBe(true);
      }
    });
  });
});
