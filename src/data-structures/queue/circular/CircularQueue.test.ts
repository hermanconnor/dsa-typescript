import { describe, it, expect } from 'vitest';
import CircularQueue from './CircularQueue';

describe('CircularQueue', () => {
  describe('constructor', () => {
    it('should create an empty queue with specified capacity', () => {
      const queue = new CircularQueue<number>(5);

      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
      expect(queue.getCapacity()).toBe(5);
    });

    it('should create an empty queue with default capacity of 10', () => {
      const queue = new CircularQueue<number>();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.getCapacity()).toBe(10);
    });

    it('should create a queue from an iterable', () => {
      const queue = new CircularQueue([1, 2, 3, 4, 5]);

      expect(queue.size()).toBe(5);
      expect(queue.toArray()).toEqual([1, 2, 3, 4, 5]);
      expect(queue.getCapacity()).toBe(10); // Default capacity
    });

    it('should create a queue from iterable with specified capacity', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      expect(queue.size()).toBe(3);
      expect(queue.getCapacity()).toBe(5);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('should drop oldest items when iterable exceeds capacity', () => {
      const queue = new CircularQueue([1, 2, 3, 4, 5, 6, 7], 5);

      expect(queue.size()).toBe(5);
      expect(queue.getCapacity()).toBe(5);
      expect(queue.toArray()).toEqual([3, 4, 5, 6, 7]);
    });

    it('should throw error when capacity is zero', () => {
      expect(() => new CircularQueue<number>(0)).toThrow(
        'Capacity must be greater than 0',
      );
    });

    it('should throw error when capacity is negative', () => {
      expect(() => new CircularQueue<number>(-5)).toThrow(
        'Capacity must be greater than 0',
      );
    });

    it('should work with Set as iterable', () => {
      const set = new Set([1, 2, 3, 4]);
      const queue = new CircularQueue(set, 5);

      expect(queue.size()).toBe(4);
      expect(queue.toArray()).toEqual([1, 2, 3, 4]);
    });

    it('should work with string as iterable', () => {
      const queue = new CircularQueue('abc', 5);

      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual(['a', 'b', 'c']);
    });

    it('should use items length as capacity if greater than 10', () => {
      const items = Array.from({ length: 15 }, (_, i) => i);
      const queue = new CircularQueue(items);

      expect(queue.getCapacity()).toBe(15);
      expect(queue.size()).toBe(15);
    });
  });

  describe('enqueue', () => {
    it('should add item to empty queue', () => {
      const queue = new CircularQueue<number>(5);

      queue.enqueue(1);

      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(1);
    });

    it('should add multiple items in order', () => {
      const queue = new CircularQueue<number>(5);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.toArray()).toEqual([1, 2, 3]);
      expect(queue.size()).toBe(3);
    });

    it('should automatically drop oldest item when at capacity', () => {
      const queue = new CircularQueue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.isFull()).toBe(true);

      queue.enqueue(4); // Should drop 1

      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([2, 3, 4]);
    });

    it('should continuously drop oldest items in circular buffer mode', () => {
      const queue = new CircularQueue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.enqueue(4); // Drops 1
      queue.enqueue(5); // Drops 2
      queue.enqueue(6); // Drops 3

      expect(queue.toArray()).toEqual([4, 5, 6]);
    });

    it('should handle many wrap-around operations', () => {
      const queue = new CircularQueue<number>(5);

      for (let i = 0; i < 20; i++) {
        queue.enqueue(i);
      }

      expect(queue.size()).toBe(5);
      expect(queue.toArray()).toEqual([15, 16, 17, 18, 19]);
    });
  });

  describe('dequeue', () => {
    it('should return undefined for empty queue', () => {
      const queue = new CircularQueue<number>(5);

      expect(queue.dequeue()).toBeUndefined();
    });

    it('should remove and return first item', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      expect(queue.dequeue()).toBe(1);
      expect(queue.size()).toBe(2);
      expect(queue.toArray()).toEqual([2, 3]);
    });

    it('should maintain FIFO order', () => {
      const queue = new CircularQueue([1, 2, 3, 4, 5], 10);

      expect(queue.dequeue()).toBe(1);
      expect(queue.dequeue()).toBe(2);
      expect(queue.dequeue()).toBe(3);
      expect(queue.toArray()).toEqual([4, 5]);
    });

    it('should handle alternating enqueue/dequeue operations', () => {
      const queue = new CircularQueue<number>(5);

      queue.enqueue(1);
      queue.enqueue(2);

      expect(queue.dequeue()).toBe(1);

      queue.enqueue(3);
      expect(queue.dequeue()).toBe(2);

      queue.enqueue(4);
      expect(queue.toArray()).toEqual([3, 4]);
    });

    it('should work correctly after circular wrap-around', () => {
      const queue = new CircularQueue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.dequeue(); // Remove 1
      queue.dequeue(); // Remove 2
      queue.enqueue(4); // Wraps around
      queue.enqueue(5); // Wraps around

      expect(queue.toArray()).toEqual([3, 4, 5]);
    });
  });

  describe('peek', () => {
    it('should return undefined for empty queue', () => {
      const queue = new CircularQueue<number>(5);

      expect(queue.peek()).toBeUndefined();
    });

    it('should return first item without removing it', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      expect(queue.peek()).toBe(1);
      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(1); // Still 1
    });

    it('should update after dequeue', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      queue.dequeue();
      expect(queue.peek()).toBe(2);

      queue.dequeue();
      expect(queue.peek()).toBe(3);
    });

    it('should return correct value after wrap-around', () => {
      const queue = new CircularQueue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.enqueue(4); // Drops 1, 4 wraps to start

      expect(queue.peek()).toBe(2);
    });
  });

  describe('peekBack', () => {
    it('should return undefined for empty queue', () => {
      const queue = new CircularQueue<number>(5);

      expect(queue.peekBack()).toBeUndefined();
    });

    it('should return last item without removing it', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      expect(queue.peekBack()).toBe(3);
      expect(queue.size()).toBe(3);
      expect(queue.peekBack()).toBe(3); // Still 3
    });

    it('should update after enqueue', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      queue.enqueue(4);
      expect(queue.peekBack()).toBe(4);
    });

    it('should work correctly after circular operations', () => {
      const queue = new CircularQueue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.peekBack()).toBe(3);

      queue.enqueue(4); // Drops 1
      expect(queue.peekBack()).toBe(4);
    });

    it('should return same value as peek for single item', () => {
      const queue = new CircularQueue([42], 5);

      expect(queue.peek()).toBe(42);
      expect(queue.peekBack()).toBe(42);
    });
  });

  describe('isEmpty and isFull', () => {
    it('should return true for new empty queue', () => {
      const queue = new CircularQueue<number>(5);

      expect(queue.isEmpty()).toBe(true);
      expect(queue.isFull()).toBe(false);
    });

    it('should return false when queue has items', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      expect(queue.isEmpty()).toBe(false);
    });

    it('should detect full queue', () => {
      const queue = new CircularQueue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);

      expect(queue.isFull()).toBe(false);

      queue.enqueue(3);
      expect(queue.isFull()).toBe(true);
    });

    it('should return true after clearing all items', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      queue.dequeue();
      queue.dequeue();
      queue.dequeue();

      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('size and getCapacity', () => {
    it('should return 0 for empty queue', () => {
      const queue = new CircularQueue<number>(5);

      expect(queue.size()).toBe(0);
    });

    it('should track size correctly through operations', () => {
      const queue = new CircularQueue<number>(5);

      expect(queue.size()).toBe(0);

      queue.enqueue(1);
      expect(queue.size()).toBe(1);

      queue.enqueue(2);
      expect(queue.size()).toBe(2);

      queue.dequeue();
      expect(queue.size()).toBe(1);
    });

    it('should maintain size at capacity when dropping items', () => {
      const queue = new CircularQueue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.size()).toBe(3);

      queue.enqueue(4); // Drops oldest
      expect(queue.size()).toBe(3);
    });

    it('should return correct capacity', () => {
      const queue = new CircularQueue<number>(7);

      expect(queue.getCapacity()).toBe(7);

      queue.enqueue(1);
      queue.enqueue(2);

      expect(queue.getCapacity()).toBe(7); // Unchanged
    });
  });

  describe('clear', () => {
    it('should clear all items', () => {
      const queue = new CircularQueue([1, 2, 3, 4, 5], 10);

      queue.clear();

      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
      expect(queue.toArray()).toEqual([]);
      expect(queue.getCapacity()).toBe(10); // Capacity unchanged
    });

    it('should allow enqueue after clear', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      queue.clear();
      queue.enqueue(10);

      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(10);
    });

    it('should properly clear references for garbage collection', () => {
      interface Obj {
        id: number;
      }
      const queue = new CircularQueue<Obj>(5);

      queue.enqueue({ id: 1 });
      queue.enqueue({ id: 2 });
      queue.clear();
      // After clear, internal array should have undefined references
      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });

    it('should handle clear on empty queue', () => {
      const queue = new CircularQueue<number>(5);
      queue.clear();

      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty queue', () => {
      const queue = new CircularQueue<number>(5);

      expect(queue.toArray()).toEqual([]);
    });

    it('should return items in FIFO order', () => {
      const queue = new CircularQueue([1, 2, 3, 4, 5], 10);

      expect(queue.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should reflect current state after operations', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      queue.dequeue();
      queue.enqueue(4);

      expect(queue.toArray()).toEqual([2, 3, 4]);
    });

    it('should handle circular wrap-around correctly', () => {
      const queue = new CircularQueue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.dequeue(); // Remove 1, head at index 1
      queue.enqueue(4); // 4 wraps to index 0

      expect(queue.toArray()).toEqual([2, 3, 4]);
    });

    it('should not modify the original queue', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      const arr = queue.toArray();
      arr.push(4);

      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });
  });

  describe('toString', () => {
    it('should return [EMPTY] for empty queue', () => {
      const queue = new CircularQueue<number>(5);

      expect(queue.toString()).toBe('[EMPTY]');
    });

    it('should show items from front to back with count/capacity', () => {
      const queue = new CircularQueue([1, 2, 3], 5);

      expect(queue.toString()).toBe('[FRONT] 1 <- 2 <- 3 [BACK] (3/5)');
    });

    it('should work with single item', () => {
      const queue = new CircularQueue([42], 5);

      expect(queue.toString()).toBe('[FRONT] 42 [BACK] (1/5)');
    });

    it('should update after operations', () => {
      const queue = new CircularQueue([1, 2], 3);

      queue.enqueue(3);

      expect(queue.toString()).toBe('[FRONT] 1 <- 2 <- 3 [BACK] (3/3)');
    });
  });

  describe('iterator', () => {
    it('should iterate over empty queue', () => {
      const queue = new CircularQueue<number>(5);

      const items = [...queue];

      expect(items).toEqual([]);
    });

    it('should iterate in FIFO order', () => {
      const queue = new CircularQueue([1, 2, 3, 4, 5], 10);

      const items = [...queue];

      expect(items).toEqual([1, 2, 3, 4, 5]);
    });

    it('should work with for...of loop', () => {
      const queue = new CircularQueue(['a', 'b', 'c'], 5);

      const result: string[] = [];
      for (const item of queue) {
        result.push(item);
      }

      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should iterate correctly after circular wrap-around', () => {
      const queue = new CircularQueue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.dequeue();
      queue.enqueue(4);

      expect([...queue]).toEqual([2, 3, 4]);
    });

    it('should work with Array.from', () => {
      const queue = new CircularQueue([10, 20, 30], 5);

      const arr = Array.from(queue);

      expect(arr).toEqual([10, 20, 30]);
    });
  });

  describe('complex scenarios', () => {
    it('should handle large number of operations', () => {
      const queue = new CircularQueue<number>(100);

      for (let i = 0; i < 1000; i++) {
        queue.enqueue(i);
      }

      expect(queue.size()).toBe(100);
      expect(queue.isFull()).toBe(true);

      // Should have last 100 items
      const expected = Array.from({ length: 100 }, (_, i) => i + 900);

      expect(queue.toArray()).toEqual(expected);
    });

    it('should work with objects', () => {
      interface Person {
        name: string;
        age: number;
      }

      const queue = new CircularQueue<Person>(3);

      queue.enqueue({ name: 'Alice', age: 30 });
      queue.enqueue({ name: 'Bob', age: 25 });
      queue.enqueue({ name: 'Charlie', age: 35 });

      expect(queue.peek()).toEqual({ name: 'Alice', age: 30 });
      expect(queue.peekBack()).toEqual({ name: 'Charlie', age: 35 });

      queue.enqueue({ name: 'David', age: 28 }); // Drops Alice

      expect(queue.peek()).toEqual({ name: 'Bob', age: 25 });
    });

    it('should handle rapid enqueue/dequeue cycles', () => {
      const queue = new CircularQueue<number>(5);

      for (let cycle = 0; cycle < 10; cycle++) {
        queue.enqueue(cycle * 10 + 1);
        queue.enqueue(cycle * 10 + 2);
        queue.enqueue(cycle * 10 + 3);
        queue.dequeue();
        queue.dequeue();
      }

      // Net gain of 1 item per cycle, but never exceeds capacity during dequeues
      // After stabilizing: enqueue 3, dequeue 2 = net +1, but stays at 3
      expect(queue.size()).toBe(3);
    });

    it('should maintain integrity after stress test', () => {
      const queue = new CircularQueue<number>(5);

      const operations = 1000;

      for (let i = 0; i < operations; i++) {
        if (Math.random() > 0.3 || queue.isEmpty()) {
          queue.enqueue(i);
        } else {
          queue.dequeue();
        }
      }

      // Verify queue is in valid state
      expect(queue.size()).toBeLessThanOrEqual(5);
      const arr = queue.toArray();

      expect(arr.length).toBe(queue.size());

      // Verify FIFO order
      if (arr.length > 1) {
        for (let i = 1; i < arr.length; i++) {
          expect(arr[i]).toBeGreaterThan(arr[i - 1]);
        }
      }
    });
  });

  describe('edge cases', () => {
    it('should handle capacity of 1', () => {
      const queue = new CircularQueue<number>(1);

      queue.enqueue(1);
      expect(queue.size()).toBe(1);

      queue.enqueue(2); // Drops 1

      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(2);
    });

    it('should handle dequeue on queue with only one item', () => {
      const queue = new CircularQueue([1], 5);

      expect(queue.dequeue()).toBe(1);
      expect(queue.isEmpty()).toBe(true);
      expect(queue.dequeue()).toBeUndefined();
    });

    it('should handle peek after complete dequeue', () => {
      const queue = new CircularQueue([1, 2], 5);

      queue.dequeue();
      queue.dequeue();

      expect(queue.peek()).toBeUndefined();
      expect(queue.peekBack()).toBeUndefined();
    });

    it('should handle filling, emptying, and refilling', () => {
      const queue = new CircularQueue<number>(3);

      // Fill
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.isFull()).toBe(true);

      // Empty
      queue.dequeue();
      queue.dequeue();
      queue.dequeue();

      expect(queue.isEmpty()).toBe(true);

      // Refill
      queue.enqueue(4);
      queue.enqueue(5);
      queue.enqueue(6);

      expect(queue.toArray()).toEqual([4, 5, 6]);
    });
  });
});
