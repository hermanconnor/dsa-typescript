import { beforeEach, describe, expect, it } from 'vitest';
import CircularDeque from './CircularDeque';

describe('CircularDeque', () => {
  let deque: CircularDeque<number>;

  beforeEach(() => {
    deque = new CircularDeque<number>();
  });

  describe('Constructor', () => {
    it('should create an empty deque with default capacity', () => {
      expect(deque.isEmpty()).toBe(true);
      expect(deque.size()).toBe(0);
      expect(deque.length).toBe(0);
      expect(deque.getCapacity()).toBe(16); // Default initial capacity
    });

    it('should create a deque from an iterable', () => {
      deque = new CircularDeque([1, 2, 3, 4]);

      expect(deque.size()).toBe(4);
      expect(deque.toArray()).toEqual([1, 2, 3, 4]);
    });

    it('should create a deque with maxlen', () => {
      deque = new CircularDeque<number>(3);

      expect(deque.getMaxLen()).toBe(3);
      expect(deque.isEmpty()).toBe(true);
      expect(deque.getCapacity()).toBe(3); // Capacity capped at maxlen
    });

    it('should create a deque from iterable with maxlen', () => {
      deque = new CircularDeque([1, 2, 3, 4, 5], 3);

      expect(deque.size()).toBe(3);
      expect(deque.toArray()).toEqual([3, 4, 5]); // Keeps last 3
    });

    it('should create a deque with custom initial capacity', () => {
      deque = new CircularDeque<number>(undefined, undefined, 32);

      expect(deque.getCapacity()).toBe(32);
    });

    it('should create a deque with custom growth factor', () => {
      deque = new CircularDeque<number>(undefined, undefined, 4, 3);
      // Fill to trigger resize
      for (let i = 0; i < 5; i++) {
        deque.addRear(i);
      }

      expect(deque.getCapacity()).toBe(12); // 4 * 3
    });

    it('should throw error for invalid maxlen', () => {
      expect(() => new CircularDeque<number>(0)).toThrow(
        'maxlen must be greater than 0',
      );

      expect(() => new CircularDeque<number>(-1)).toThrow(
        'maxlen must be greater than 0',
      );
    });

    it('should throw error for invalid initialCapacity', () => {
      expect(() => new CircularDeque<number>(undefined, undefined, 0)).toThrow(
        'initialCapacity must be greater than 0',
      );

      expect(() => new CircularDeque<number>(undefined, undefined, -1)).toThrow(
        'initialCapacity must be greater than 0',
      );
    });

    it('should throw error for invalid growthFactor', () => {
      expect(
        () => new CircularDeque<number>(undefined, undefined, 16, 1),
      ).toThrow('growthFactor must be greater than 1');

      expect(
        () => new CircularDeque<number>(undefined, undefined, 16, 0.5),
      ).toThrow('growthFactor must be greater than 1');
    });

    it('should handle large initial iterable', () => {
      const items = Array.from({ length: 100 }, (_, i) => i);
      deque = new CircularDeque(items);

      expect(deque.size()).toBe(100);
      expect(deque.toArray()).toEqual(items);
    });

    it('should use maxlen as capacity when smaller than initialCapacity', () => {
      deque = new CircularDeque<number>(5, undefined, 32);

      expect(deque.getCapacity()).toBe(5); // maxlen is smaller
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
      deque = new CircularDeque<number>(3);

      deque.addFront(1);
      deque.addFront(2);
      deque.addFront(3);
      deque.addFront(4); // Should remove 1 from rear

      expect(deque.toArray()).toEqual([4, 3, 2]);
      expect(deque.size()).toBe(3);
    });

    it('should trigger resize when capacity is reached', () => {
      deque = new CircularDeque<number>(undefined, undefined, 2);

      deque.addFront(1);
      deque.addFront(2);

      expect(deque.getCapacity()).toBe(2);

      deque.addFront(3); // Should resize

      expect(deque.getCapacity()).toBe(4);
      expect(deque.toArray()).toEqual([3, 2, 1]);
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
      deque = new CircularDeque<number>(3);

      deque.addRear(1);
      deque.addRear(2);
      deque.addRear(3);
      deque.addRear(4); // Should remove 1 from front

      expect(deque.toArray()).toEqual([2, 3, 4]);
      expect(deque.size()).toBe(3);
    });

    it('should trigger resize when capacity is reached', () => {
      deque = new CircularDeque<number>(undefined, undefined, 2);

      deque.addRear(1);
      deque.addRear(2);

      expect(deque.getCapacity()).toBe(2);

      deque.addRear(3); // Should resize
      expect(deque.getCapacity()).toBe(4);
      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    it('should handle wrapping around buffer', () => {
      deque = new CircularDeque<number>(undefined, undefined, 4);

      deque.addRear(1);
      deque.addRear(2);
      deque.removeFront(); // Creates gap at front
      deque.removeFront();
      deque.addRear(3);
      deque.addRear(4);
      deque.addRear(5); // Wraps around

      expect(deque.toArray()).toEqual([3, 4, 5]);
    });
  });

  describe('removeFront', () => {
    it('should return undefined for empty deque', () => {
      expect(deque.removeFront()).toBeUndefined();
    });

    it('should remove and return front element', () => {
      deque = new CircularDeque([1, 2, 3]);

      expect(deque.removeFront()).toBe(1);
      expect(deque.toArray()).toEqual([2, 3]);
      expect(deque.size()).toBe(2);
    });

    it('should handle removing from single-element deque', () => {
      deque = new CircularDeque([1]);

      expect(deque.removeFront()).toBe(1);
      expect(deque.isEmpty()).toBe(true);
      expect(deque.peekFront()).toBeUndefined();
      expect(deque.peekRear()).toBeUndefined();
    });

    it('should trigger shrink when utilization is low', () => {
      deque = new CircularDeque<number>(undefined, undefined, 4);
      // Fill to trigger resize to 8
      for (let i = 0; i < 5; i++) {
        deque.addRear(i);
      }

      const capacityAfterResize = deque.getCapacity();
      expect(capacityAfterResize).toBe(8);

      // Remove most elements to trigger shrink
      for (let i = 0; i < 4; i++) {
        deque.removeFront();
      }
      // Should shrink when count < capacity/4
      expect(deque.getCapacity()).toBeLessThan(capacityAfterResize);
    });

    it('should not shrink below initial capacity', () => {
      deque = new CircularDeque<number>(undefined, undefined, 8);

      deque.addRear(1);
      deque.removeFront();

      expect(deque.getCapacity()).toBe(8);
    });
  });

  describe('removeRear', () => {
    it('should return undefined for empty deque', () => {
      expect(deque.removeRear()).toBeUndefined();
    });

    it('should remove and return rear element', () => {
      deque = new CircularDeque([1, 2, 3]);

      expect(deque.removeRear()).toBe(3);
      expect(deque.toArray()).toEqual([1, 2]);
      expect(deque.size()).toBe(2);
    });

    it('should handle removing from single-element deque', () => {
      deque = new CircularDeque([1]);

      expect(deque.removeRear()).toBe(1);
      expect(deque.isEmpty()).toBe(true);
      expect(deque.peekFront()).toBeUndefined();
      expect(deque.peekRear()).toBeUndefined();
    });
  });

  describe('peekFront and peekRear', () => {
    it('should return undefined for empty deque', () => {
      expect(deque.peekFront()).toBeUndefined();
      expect(deque.peekRear()).toBeUndefined();
    });

    it('should return front and rear without removing', () => {
      deque = new CircularDeque([1, 2, 3]);

      expect(deque.peekFront()).toBe(1);
      expect(deque.peekRear()).toBe(3);
      expect(deque.size()).toBe(3); // Size unchanged
    });

    it('should handle wrapping indices correctly', () => {
      deque = new CircularDeque<number>(undefined, undefined, 4);

      deque.addRear(1);
      deque.addRear(2);
      deque.removeFront();
      deque.addRear(3);
      deque.addRear(4);

      expect(deque.peekFront()).toBe(2);
      expect(deque.peekRear()).toBe(4);
    });
  });

  describe('contains', () => {
    it('should return false for empty deque', () => {
      expect(deque.contains(1)).toBe(false);
    });

    it('should find existing elements', () => {
      deque = new CircularDeque([1, 2, 3, 4, 5]);

      expect(deque.contains(1)).toBe(true);
      expect(deque.contains(3)).toBe(true);
      expect(deque.contains(5)).toBe(true);
    });

    it('should return false for non-existing elements', () => {
      deque = new CircularDeque([1, 2, 3]);

      expect(deque.contains(4)).toBe(false);
      expect(deque.contains(0)).toBe(false);
    });

    it('should work with wrapped buffer', () => {
      deque = new CircularDeque<number>(undefined, undefined, 4);

      deque.addRear(1);
      deque.addRear(2);
      deque.removeFront();
      deque.addRear(3);
      deque.addRear(4);

      expect(deque.contains(2)).toBe(true);
      expect(deque.contains(4)).toBe(true);
      expect(deque.contains(1)).toBe(false);
    });
  });

  describe('get', () => {
    it('should return undefined for empty deque', () => {
      expect(deque.get(0)).toBeUndefined();
    });

    it('should get elements by positive index', () => {
      deque = new CircularDeque([10, 20, 30, 40, 50]);

      expect(deque.get(0)).toBe(10);
      expect(deque.get(2)).toBe(30);
      expect(deque.get(4)).toBe(50);
    });

    it('should get elements by negative index', () => {
      deque = new CircularDeque([10, 20, 30, 40, 50]);

      expect(deque.get(-1)).toBe(50);
      expect(deque.get(-3)).toBe(30);
      expect(deque.get(-5)).toBe(10);
    });

    it('should return undefined for out of bounds', () => {
      deque = new CircularDeque([1, 2, 3]);

      expect(deque.get(3)).toBeUndefined();
      expect(deque.get(-4)).toBeUndefined();
      expect(deque.get(100)).toBeUndefined();
    });

    it('should work with wrapped buffer', () => {
      deque = new CircularDeque<number>(undefined, undefined, 4);

      deque.addRear(1);
      deque.addRear(2);
      deque.removeFront();
      deque.addRear(3);
      deque.addRear(4);

      expect(deque.get(0)).toBe(2);
      expect(deque.get(1)).toBe(3);
      expect(deque.get(2)).toBe(4);
    });
  });

  describe('extend', () => {
    it('should add multiple items to rear', () => {
      deque = new CircularDeque([1, 2]);

      deque.extend([3, 4, 5]);

      expect(deque.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with empty deque', () => {
      deque.extend([1, 2, 3]);

      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    it('should respect maxlen', () => {
      deque = new CircularDeque<number>([1, 2], 4);

      deque.extend([3, 4, 5, 6]);

      expect(deque.toArray()).toEqual([3, 4, 5, 6]);
      expect(deque.size()).toBe(4);
    });

    it('should trigger resize as needed', () => {
      deque = new CircularDeque<number>(undefined, undefined, 2);

      deque.extend([1, 2, 3, 4, 5]);

      expect(deque.size()).toBe(5);
      expect(deque.toArray()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('extendLeft', () => {
    it('should add multiple items to front in order', () => {
      deque = new CircularDeque([4, 5]);

      deque.extendLeft([1, 2, 3]);

      expect(deque.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with empty deque', () => {
      deque.extendLeft([1, 2, 3]);

      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    it('should respect maxlen', () => {
      deque = new CircularDeque<number>([9, 10], 4);

      deque.extendLeft([5, 6, 7, 8]);

      expect(deque.toArray()).toEqual([5, 6, 7, 8]);
      expect(deque.size()).toBe(4);
    });
  });

  describe('rotate', () => {
    it('should do nothing for empty deque', () => {
      deque.rotate(5);

      expect(deque.isEmpty()).toBe(true);
    });

    it('should do nothing for single-element deque', () => {
      deque = new CircularDeque([1]);

      deque.rotate(5);

      expect(deque.toArray()).toEqual([1]);
    });

    it('should rotate right (positive n) by adjusting indices', () => {
      deque = new CircularDeque([1, 2, 3, 4, 5]);

      deque.rotate(2);

      expect(deque.toArray()).toEqual([4, 5, 1, 2, 3]);
    });

    it('should rotate left (negative n) by adjusting indices', () => {
      deque = new CircularDeque([1, 2, 3, 4, 5]);

      deque.rotate(-2);

      expect(deque.toArray()).toEqual([3, 4, 5, 1, 2]);
    });

    it('should handle rotation greater than size', () => {
      deque = new CircularDeque([1, 2, 3]);

      deque.rotate(5); // 5 % 3 = 2

      expect(deque.toArray()).toEqual([2, 3, 1]);
    });

    it('should handle default rotation of 1', () => {
      deque = new CircularDeque([1, 2, 3]);

      deque.rotate();

      expect(deque.toArray()).toEqual([3, 1, 2]);
    });

    it('should handle zero rotation', () => {
      deque = new CircularDeque([1, 2, 3]);

      deque.rotate(0);

      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    it('should handle large rotation efficiently', () => {
      deque = new CircularDeque(Array.from({ length: 100 }, (_, i) => i));

      deque.rotate(50);

      expect(deque.get(0)).toBe(50);
      expect(deque.get(99)).toBe(49);
    });
  });

  describe('clear', () => {
    it('should clear empty deque', () => {
      deque.clear();

      expect(deque.isEmpty()).toBe(true);
    });

    it('should clear all elements', () => {
      deque = new CircularDeque([1, 2, 3, 4, 5]);

      deque.clear();

      expect(deque.isEmpty()).toBe(true);
      expect(deque.size()).toBe(0);
      expect(deque.peekFront()).toBeUndefined();
      expect(deque.peekRear()).toBeUndefined();
    });

    it('should reset to initial capacity', () => {
      deque = new CircularDeque<number>(undefined, undefined, 8);

      for (let i = 0; i < 20; i++) {
        deque.addRear(i);
      }

      expect(deque.getCapacity()).toBeGreaterThan(8);

      deque.clear();
      expect(deque.getCapacity()).toBe(8);
    });

    it('should preserve maxlen after clear', () => {
      deque = new CircularDeque<number>([1, 2, 3], 3);

      deque.clear();

      expect(deque.getMaxLen()).toBe(3);

      deque.extend([1, 2, 3, 4]);
      expect(deque.size()).toBe(3);
    });
  });

  describe('toString', () => {
    it('should return [EMPTY] for empty deque', () => {
      expect(deque.toString()).toBe('[EMPTY]');
    });

    it('should format single element', () => {
      deque = new CircularDeque([42]);

      expect(deque.toString()).toBe('[FRONT] 42 [REAR]');
    });

    it('should format multiple elements', () => {
      deque = new CircularDeque([1, 2, 3]);

      expect(deque.toString()).toBe('[FRONT] 1 <-> 2 <-> 3 [REAR]');
    });
  });

  describe('Iterator', () => {
    it('should iterate over empty deque', () => {
      const result = [...deque];

      expect(result).toEqual([]);
    });

    it('should iterate from front to rear', () => {
      deque = new CircularDeque([1, 2, 3, 4]);

      const result = [...deque];

      expect(result).toEqual([1, 2, 3, 4]);
    });

    it('should work with for...of loop', () => {
      deque = new CircularDeque([10, 20, 30]);

      const result: number[] = [];

      for (const value of deque) {
        result.push(value);
      }

      expect(result).toEqual([10, 20, 30]);
    });

    it('should work with wrapped buffer', () => {
      deque = new CircularDeque<number>(undefined, undefined, 4);

      deque.addRear(1);
      deque.addRear(2);
      deque.removeFront();
      deque.addRear(3);
      deque.addRear(4);

      expect([...deque]).toEqual([2, 3, 4]);
    });
  });

  describe('reverseIterator', () => {
    it('should iterate over empty deque', () => {
      const result = [...deque.reverseIterator()];

      expect(result).toEqual([]);
    });

    it('should iterate from rear to front', () => {
      deque = new CircularDeque([1, 2, 3, 4]);

      const result = [...deque.reverseIterator()];

      expect(result).toEqual([4, 3, 2, 1]);
    });

    it('should work with for...of loop', () => {
      const deque = new CircularDeque(['a', 'b', 'c']);

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

    it('should handle complex scenario with maxlen and rotation', () => {
      deque = new CircularDeque<number>(3);

      deque.addRear(1);
      deque.addRear(2);
      deque.addRear(3);

      expect(deque.toArray()).toEqual([1, 2, 3]);

      deque.addRear(4);
      expect(deque.toArray()).toEqual([2, 3, 4]);

      deque.rotate(1);
      expect(deque.toArray()).toEqual([4, 2, 3]);

      deque.addFront(1);
      expect(deque.toArray()).toEqual([1, 4, 2]);
    });

    it('should handle large dataset efficiently', () => {
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

    it('should demonstrate circular buffer advantage', () => {
      deque = new CircularDeque<number>(undefined, undefined, 4);

      // Fill buffer
      for (let i = 1; i <= 4; i++) {
        deque.addRear(i);
      }

      expect(deque.getCapacity()).toBe(4);

      // Remove and add to create wrap-around
      deque.removeFront(); // Remove 1
      deque.removeFront(); // Remove 2
      deque.addRear(5);
      deque.addRear(6);

      expect(deque.toArray()).toEqual([3, 4, 5, 6]);
      expect(deque.getCapacity()).toBe(4); // No resize needed
    });
  });

  describe('Performance Characteristics', () => {
    it('should handle rotation efficiently', () => {
      const size = 100;
      deque = new CircularDeque(Array.from({ length: size }, (_, i) => i));

      deque.rotate(50);

      expect(deque.get(0)).toBe(50); // Verify rotation worked
      expect(deque.toArray().length).toBe(size);
    });

    it('should demonstrate efficient memory usage with shrinking', () => {
      deque = new CircularDeque<number>(undefined, undefined, 4);

      // Grow the deque
      for (let i = 0; i < 20; i++) {
        deque.addRear(i);
      }

      const grownCapacity = deque.getCapacity();
      expect(grownCapacity).toBeGreaterThan(4);

      // Shrink the deque
      for (let i = 0; i < 18; i++) {
        deque.removeFront();
      }

      // Should shrink capacity
      expect(deque.getCapacity()).toBeLessThan(grownCapacity);
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

    it('should handle null and undefined values', () => {
      const deque = new CircularDeque<number | null | undefined>([
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

    it('should handle maxlen of 1', () => {
      deque = new CircularDeque<number>(1);

      deque.addRear(1);

      expect(deque.size()).toBe(1);

      deque.addRear(2);

      expect(deque.size()).toBe(1);
      expect(deque.peekFront()).toBe(2);
    });
  });
});
