import { describe, it, expect } from 'vitest';
import StacksQueue from './StacksQueue';

describe('StacksQueue', () => {
  describe('constructor', () => {
    it('should create an empty queue when no arguments provided', () => {
      const queue = new StacksQueue<number>();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('should create a queue from an iterable', () => {
      const queue = new StacksQueue([1, 2, 3, 4, 5]);
      expect(queue.size()).toBe(5);
      expect(queue.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should create a queue with maxlen capacity only', () => {
      const queue = new StacksQueue<number>(5);
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('should create a queue from iterable with maxlen', () => {
      const queue = new StacksQueue([1, 2, 3], 5);
      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('should drop oldest items when iterable exceeds maxlen', () => {
      const queue = new StacksQueue([1, 2, 3, 4, 5], 3);
      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([3, 4, 5]);
    });

    it('should throw error when maxlen is zero', () => {
      expect(() => new StacksQueue<number>(0)).toThrow(
        'maxlen must be greater than 0',
      );
    });

    it('should throw error when maxlen is negative', () => {
      expect(() => new StacksQueue<number>(-5)).toThrow(
        'maxlen must be greater than 0',
      );
    });

    it('should work with Set as iterable', () => {
      const set = new Set([1, 2, 3]);
      const queue = new StacksQueue(set);
      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('should work with string as iterable', () => {
      const queue = new StacksQueue('hello');
      expect(queue.size()).toBe(5);
      expect(queue.toArray()).toEqual(['h', 'e', 'l', 'l', 'o']);
    });
  });

  describe('enqueue', () => {
    it('should add item to empty queue', () => {
      const queue = new StacksQueue<number>();
      queue.enqueue(1);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(1);
    });

    it('should add multiple items in order', () => {
      const queue = new StacksQueue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('should drop oldest item when at capacity (circular buffer)', () => {
      const queue = new StacksQueue<number>(3);
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.enqueue(4); // Should drop 1
      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([2, 3, 4]);
    });

    it('should continuously drop oldest items in circular buffer mode', () => {
      const queue = new StacksQueue([1, 2, 3], 3);
      queue.enqueue(4); // Drops 1
      queue.enqueue(5); // Drops 2
      queue.enqueue(6); // Drops 3
      expect(queue.toArray()).toEqual([4, 5, 6]);
    });
  });

  describe('dequeue', () => {
    it('should return undefined for empty queue', () => {
      const queue = new StacksQueue<number>();
      expect(queue.dequeue()).toBeUndefined();
    });

    it('should remove and return first item', () => {
      const queue = new StacksQueue([1, 2, 3]);
      expect(queue.dequeue()).toBe(1);
      expect(queue.size()).toBe(2);
      expect(queue.toArray()).toEqual([2, 3]);
    });

    it('should maintain FIFO order', () => {
      const queue = new StacksQueue([1, 2, 3, 4, 5]);
      expect(queue.dequeue()).toBe(1);
      expect(queue.dequeue()).toBe(2);
      expect(queue.dequeue()).toBe(3);
      expect(queue.toArray()).toEqual([4, 5]);
    });

    it('should handle alternating enqueue/dequeue operations', () => {
      const queue = new StacksQueue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      expect(queue.dequeue()).toBe(1);
      queue.enqueue(3);
      expect(queue.dequeue()).toBe(2);
      expect(queue.dequeue()).toBe(3);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('peek', () => {
    it('should return undefined for empty queue', () => {
      const queue = new StacksQueue<number>();
      expect(queue.peek()).toBeUndefined();
    });

    it('should return first item without removing it', () => {
      const queue = new StacksQueue([1, 2, 3]);
      expect(queue.peek()).toBe(1);
      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(1); // Still 1
    });

    it('should update after dequeue', () => {
      const queue = new StacksQueue([1, 2, 3]);
      queue.dequeue();
      expect(queue.peek()).toBe(2);
    });
  });

  describe('size', () => {
    it('should return 0 for empty queue', () => {
      const queue = new StacksQueue<number>();
      expect(queue.size()).toBe(0);
    });

    it('should track size correctly through operations', () => {
      const queue = new StacksQueue<number>();
      expect(queue.size()).toBe(0);
      queue.enqueue(1);
      expect(queue.size()).toBe(1);
      queue.enqueue(2);
      expect(queue.size()).toBe(2);
      queue.dequeue();
      expect(queue.size()).toBe(1);
    });
  });

  describe('isEmpty', () => {
    it('should return true for new queue', () => {
      const queue = new StacksQueue<number>();
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false when queue has items', () => {
      const queue = new StacksQueue([1, 2, 3]);
      expect(queue.isEmpty()).toBe(false);
    });

    it('should return true after clearing all items', () => {
      const queue = new StacksQueue([1, 2, 3]);
      queue.dequeue();
      queue.dequeue();
      queue.dequeue();
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      const queue = new StacksQueue([1, 2, 3, 4, 5]);
      queue.clear();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
      expect(queue.toArray()).toEqual([]);
    });

    it('should allow enqueue after clear', () => {
      const queue = new StacksQueue([1, 2, 3]);
      queue.clear();
      queue.enqueue(10);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(10);
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty queue', () => {
      const queue = new StacksQueue<number>();
      expect(queue.toArray()).toEqual([]);
    });

    it('should return items in FIFO order', () => {
      const queue = new StacksQueue([1, 2, 3, 4, 5]);
      expect(queue.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should reflect current state after operations', () => {
      const queue = new StacksQueue([1, 2, 3]);
      queue.dequeue();
      queue.enqueue(4);
      expect(queue.toArray()).toEqual([2, 3, 4]);
    });

    it('should work correctly after stack transfer', () => {
      const queue = new StacksQueue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.dequeue(); // Triggers transfer
      queue.enqueue(4);
      expect(queue.toArray()).toEqual([2, 3, 4]);
    });
  });

  describe('iterator', () => {
    it('should iterate over empty queue', () => {
      const queue = new StacksQueue<number>();
      const items = [...queue];
      expect(items).toEqual([]);
    });

    it('should iterate in FIFO order', () => {
      const queue = new StacksQueue([1, 2, 3, 4, 5]);
      const items = [...queue];
      expect(items).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with for...of loop', () => {
      const queue = new StacksQueue(['a', 'b', 'c']);
      const result: string[] = [];
      for (const item of queue) {
        result.push(item);
      }
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should iterate correctly after mixed operations', () => {
      const queue = new StacksQueue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.dequeue();
      queue.enqueue(3);
      queue.enqueue(4);
      expect([...queue]).toEqual([2, 3, 4]);
    });
  });

  describe('complex scenarios', () => {
    it('should handle large number of operations', () => {
      const queue = new StacksQueue<number>();
      for (let i = 0; i < 1000; i++) {
        queue.enqueue(i);
      }
      expect(queue.size()).toBe(1000);

      for (let i = 0; i < 500; i++) {
        expect(queue.dequeue()).toBe(i);
      }
      expect(queue.size()).toBe(500);
    });

    it('should maintain correctness with circular buffer over many operations', () => {
      const queue = new StacksQueue<number>(5);
      for (let i = 0; i < 20; i++) {
        queue.enqueue(i);
      }
      expect(queue.size()).toBe(5);
      expect(queue.toArray()).toEqual([15, 16, 17, 18, 19]);
    });

    it('should work with objects', () => {
      interface Person {
        name: string;
        age: number;
      }

      const queue = new StacksQueue<Person>();
      queue.enqueue({ name: 'Alice', age: 30 });
      queue.enqueue({ name: 'Bob', age: 25 });

      expect(queue.peek()).toEqual({ name: 'Alice', age: 30 });
      expect(queue.dequeue()).toEqual({ name: 'Alice', age: 30 });
      expect(queue.size()).toBe(1);
    });

    it('should handle rapid enqueue/dequeue cycles', () => {
      const queue = new StacksQueue<number>();

      for (let cycle = 0; cycle < 10; cycle++) {
        queue.enqueue(cycle * 10 + 1);
        queue.enqueue(cycle * 10 + 2);
        queue.enqueue(cycle * 10 + 3);
        queue.dequeue();
        queue.dequeue();
      }

      expect(queue.size()).toBe(10);
    });
  });

  describe('edge cases', () => {
    it('should handle maxlen of 1', () => {
      const queue = new StacksQueue<number>(1);
      queue.enqueue(1);
      queue.enqueue(2);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(2);
    });

    it('should handle dequeue on queue with only one item', () => {
      const queue = new StacksQueue([1]);
      expect(queue.dequeue()).toBe(1);
      expect(queue.isEmpty()).toBe(true);
      expect(queue.dequeue()).toBeUndefined();
    });

    it('should handle peek after complete dequeue', () => {
      const queue = new StacksQueue([1, 2]);
      queue.dequeue();
      queue.dequeue();
      expect(queue.peek()).toBeUndefined();
    });
  });
});
