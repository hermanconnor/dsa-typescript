import { describe, it, expect, beforeEach } from 'vitest';
import Queue from './Queue';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue<number>();
  });

  describe('Constructor with maxlen', () => {
    it('should create an empty queue with maxlen', () => {
      const queue = new Queue<number>(5);

      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });

    it('should accept maxlen as first argument (backward compatibility)', () => {
      const queue = new Queue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.enqueue(4); // Should dequeue 1

      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([2, 3, 4]);
    });

    it('should create queue from iterable with maxlen as second argument', () => {
      const queue = new Queue<number>([1, 2, 3, 4, 5], 3);

      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([3, 4, 5]);
    });

    it('should keep last maxlen items when initial items exceed maxlen', () => {
      const queue = new Queue<number>([1, 2, 3, 4, 5, 6, 7], 4);

      expect(queue.size()).toBe(4);
      expect(queue.toArray()).toEqual([4, 5, 6, 7]);
    });

    it('should keep all items when initial items are less than maxlen', () => {
      const queue = new Queue<number>([1, 2, 3], 5);

      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('should throw error when maxlen is 0', () => {
      expect(() => new Queue<number>(0)).toThrow(
        'maxlen must be greater than 0',
      );
    });

    it('should throw error when maxlen is negative', () => {
      expect(() => new Queue<number>(-5)).toThrow(
        'maxlen must be greater than 0',
      );
    });

    it('should work with maxlen of 1', () => {
      const queue = new Queue<number>([1, 2, 3], 1);

      expect(queue.size()).toBe(1);
      expect(queue.toArray()).toEqual([3]);
    });

    it('should create queue without maxlen when not provided', () => {
      const queue = new Queue<number>([1, 2, 3]);

      expect(queue.size()).toBe(3);

      queue.enqueue(4);
      queue.enqueue(5);

      expect(queue.size()).toBe(5);
      expect(queue.toArray()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should handle empty iterable with maxlen', () => {
      const queue = new Queue<number>([], 3);

      expect(queue.size()).toBe(0);
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('enqueue', () => {
    it('should initialize an empty queue', () => {
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
      expect(queue.peek()).toBeUndefined();
      expect(queue.peekBack()).toBeUndefined();
    });

    it('should initialize with elements from an array (Iterable)', () => {
      const initial = [10, 20, 30];
      const q = new Queue(initial);

      expect(q.size()).toBe(3);
      expect(q.isEmpty()).toBe(false);
      // Head (Front) should be 10 (FIFO)
      expect(q.peek()).toBe(10);
      // Tail (Back) should be 30
      expect(q.peekBack()).toBe(30);
    });

    it('should add multiple elements maintaining FIFO order', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(1);
      expect(queue.peekBack()).toBe(3);
    });

    it('should handle different data types', () => {
      const stringQueue = new Queue<string>();

      stringQueue.enqueue('hello');
      stringQueue.enqueue('world');

      expect(stringQueue.peek()).toBe('hello');
    });
  });

  describe('Enqueue with maxlen', () => {
    it('should automatically dequeue when maxlen is reached', () => {
      const queue = new Queue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(1);

      queue.enqueue(4); // Should remove 1

      expect(queue.size()).toBe(3);
      expect(queue.peek()).toBe(2);
      expect(queue.toArray()).toEqual([2, 3, 4]);
    });

    it('should maintain FIFO order with maxlen', () => {
      const queue = new Queue<number>(3);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.enqueue(4);
      queue.enqueue(5);

      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([3, 4, 5]);
      expect(queue.peek()).toBe(3);
      expect(queue.peekBack()).toBe(5);
    });

    it('should handle multiple enqueueing past maxlen', () => {
      const queue = new Queue<string>(2);

      queue.enqueue('a');
      queue.enqueue('b');
      queue.enqueue('c');
      queue.enqueue('d');
      queue.enqueue('e');

      expect(queue.size()).toBe(2);
      expect(queue.toArray()).toEqual(['d', 'e']);
    });

    it('should work normally when below maxlen', () => {
      const queue = new Queue<number>(5);

      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('should work with maxlen of 1', () => {
      const queue = new Queue<number>(1);

      queue.enqueue(1);
      expect(queue.peek()).toBe(1);

      queue.enqueue(2);
      expect(queue.peek()).toBe(2);
      expect(queue.size()).toBe(1);

      queue.enqueue(3);
      expect(queue.peek()).toBe(3);
      expect(queue.size()).toBe(1);
    });

    it('should not limit size when maxlen is not set', () => {
      const queue = new Queue<number>();

      for (let i = 0; i < 100; i++) {
        queue.enqueue(i);
      }

      expect(queue.size()).toBe(100);
    });
  });

  describe('Mixed operations with maxlen', () => {
    it('should handle enqueue and dequeue correctly with maxlen', () => {
      const queue = new Queue<number>(3);
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.dequeue()).toBe(1);
      expect(queue.size()).toBe(2);

      queue.enqueue(4);
      queue.enqueue(5);
      expect(queue.size()).toBe(3);
      expect(queue.toArray()).toEqual([3, 4, 5]);
    });

    it('should update head and tail correctly when auto-dequeuing', () => {
      const queue = new Queue<number>(2);
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.peek()).toBe(2);
      expect(queue.peekBack()).toBe(3);
    });

    it('should work with clear and re-population', () => {
      const queue = new Queue<number>(3);
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      queue.clear();
      expect(queue.size()).toBe(0);

      queue.enqueue(4);
      queue.enqueue(5);
      expect(queue.size()).toBe(2);
      expect(queue.toArray()).toEqual([4, 5]);
    });
  });

  describe('Iterator with maxlen', () => {
    it('should iterate correctly over bounded queue', () => {
      const queue = new Queue<number>([1, 2, 3, 4, 5], 3);

      const result = [];
      for (const item of queue) {
        result.push(item);
      }

      expect(result).toEqual([3, 4, 5]);
    });

    it('should work with spread operator', () => {
      const queue = new Queue<string>(2);

      queue.enqueue('a');
      queue.enqueue('b');
      queue.enqueue('c');

      expect([...queue]).toEqual(['b', 'c']);
    });
  });

  describe('dequeue', () => {
    it('should return undefined for empty queue', () => {
      expect(queue.dequeue()).toBeUndefined();
    });

    it('should remove and return front element', () => {
      queue.enqueue(1);
      queue.enqueue(2);

      const result = queue.dequeue();

      expect(result).toBe(1);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(2);
    });

    it('should maintain FIFO order', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.dequeue()).toBe(1);
      expect(queue.dequeue()).toBe(2);
      expect(queue.dequeue()).toBe(3);
      expect(queue.dequeue()).toBeUndefined();
    });

    it('should handle dequeue until empty', () => {
      queue.enqueue(1);
      queue.dequeue();

      expect(queue.isEmpty()).toBe(true);
      expect(queue.peek()).toBeUndefined();
      expect(queue.peekBack()).toBeUndefined();
    });

    it('should allow enqueue after dequeue to empty', () => {
      queue.enqueue(1);
      queue.dequeue();
      queue.enqueue(2);

      expect(queue.peek()).toBe(2);
      expect(queue.size()).toBe(1);
    });
  });

  describe('peek', () => {
    it('should return undefined for empty queue', () => {
      expect(queue.peek()).toBeUndefined();
    });

    it('should return front element without removing it', () => {
      queue.enqueue(1);
      queue.enqueue(2);

      expect(queue.peek()).toBe(1);
      expect(queue.size()).toBe(2);
      expect(queue.peek()).toBe(1); // Still 1
    });
  });

  describe('peekBack', () => {
    it('should return undefined for empty queue', () => {
      expect(queue.peekBack()).toBeUndefined();
    });

    it('should return back element without removing it', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.peekBack()).toBe(3);
      expect(queue.size()).toBe(3);
      expect(queue.peekBack()).toBe(3); // Still 3
    });

    it('should return same element as peek for single-element queue', () => {
      queue.enqueue(1);

      expect(queue.peek()).toBe(queue.peekBack());
    });
  });

  describe('isEmpty', () => {
    it('should return true for new queue', () => {
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false after enqueue', () => {
      queue.enqueue(1);

      expect(queue.isEmpty()).toBe(false);
    });

    it('should return true after dequeuing all elements', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.dequeue();
      queue.dequeue();

      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('size', () => {
    it('should return 0 for empty queue', () => {
      expect(queue.size()).toBe(0);
    });

    it('should track size correctly', () => {
      expect(queue.size()).toBe(0);
      queue.enqueue(1);
      expect(queue.size()).toBe(1);
      queue.enqueue(2);
      expect(queue.size()).toBe(2);
      queue.dequeue();
      expect(queue.size()).toBe(1);
      queue.dequeue();
      expect(queue.size()).toBe(0);
    });

    it('should handle multiple enqueue/dequeue operations', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.dequeue();
      queue.enqueue(3);
      queue.enqueue(4);
      queue.dequeue();

      expect(queue.size()).toBe(2);
    });
  });

  describe('clear', () => {
    it('should clear empty queue', () => {
      queue.clear();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('should remove all elements', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      queue.clear();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
      expect(queue.peek()).toBeUndefined();
      expect(queue.peekBack()).toBeUndefined();
    });

    it('should allow operations after clear', () => {
      queue.enqueue(1);
      queue.clear();
      queue.enqueue(2);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe(2);
    });
  });

  describe('iterator', () => {
    it('should iterate over empty queue', () => {
      const items = [...queue];
      expect(items).toEqual([]);
    });

    it('should iterate in FIFO order', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);
      const items = [...queue];
      expect(items).toEqual([1, 2, 3]);
    });

    it('should work with for...of loop', () => {
      queue.enqueue(10);
      queue.enqueue(20);
      queue.enqueue(30);

      const collected: number[] = [];
      for (const item of queue) {
        collected.push(item);
      }

      expect(collected).toEqual([10, 20, 30]);
    });

    it('should not modify queue during iteration', () => {
      queue.enqueue(1);
      queue.enqueue(2);

      const result = [...queue]; // Iterate

      expect(result.length).toBe(2);
      expect(queue.size()).toBe(2);
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty queue', () => {
      expect(queue.toArray()).toEqual([]);
    });

    it('should return array in FIFO order', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.toArray()).toEqual([1, 2, 3]);
    });

    it('should not modify original queue', () => {
      queue.enqueue(1);
      queue.enqueue(2);

      const arr = queue.toArray();
      arr.push(3);

      expect(queue.size()).toBe(2);
    });
  });

  describe('toString', () => {
    it('should return [EMPTY] for empty queue', () => {
      expect(queue.toString()).toBe('[EMPTY]');
    });

    it('should format single element', () => {
      queue.enqueue(1);

      expect(queue.toString()).toBe('[FRONT] 1 [BACK]');
    });

    it('should format multiple elements with arrows', () => {
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      expect(queue.toString()).toBe('[FRONT] 1 <- 2 <- 3 [BACK]');
    });
  });

  describe('edge cases', () => {
    it('should handle alternating enqueue/dequeue', () => {
      queue.enqueue(1);
      expect(queue.dequeue()).toBe(1);
      queue.enqueue(2);
      expect(queue.dequeue()).toBe(2);
      queue.enqueue(3);
      expect(queue.peek()).toBe(3);
    });

    it('should handle large number of operations', () => {
      for (let i = 0; i < 1000; i++) {
        queue.enqueue(i);
      }

      expect(queue.size()).toBe(1000);

      for (let i = 0; i < 500; i++) {
        queue.dequeue();
      }

      expect(queue.size()).toBe(500);
      expect(queue.peek()).toBe(500);
    });

    it('should handle objects', () => {
      const objQueue = new Queue<{ id: number; name: string }>();

      const obj1 = { id: 1, name: 'Alice' };
      const obj2 = { id: 2, name: 'Bob' };
      objQueue.enqueue(obj1);
      objQueue.enqueue(obj2);

      expect(objQueue.dequeue()).toBe(obj1);
      expect(objQueue.peek()).toBe(obj2);
    });

    it('should handle null and undefined values', () => {
      const nullQueue = new Queue<number | null | undefined>();

      nullQueue.enqueue(null);
      nullQueue.enqueue(undefined);
      nullQueue.enqueue(0);

      expect(nullQueue.dequeue()).toBe(null);
      expect(nullQueue.dequeue()).toBe(undefined);
      expect(nullQueue.dequeue()).toBe(0);
    });
  });
});
