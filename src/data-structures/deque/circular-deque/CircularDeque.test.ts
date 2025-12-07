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
});
