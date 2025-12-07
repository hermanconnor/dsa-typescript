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
});
