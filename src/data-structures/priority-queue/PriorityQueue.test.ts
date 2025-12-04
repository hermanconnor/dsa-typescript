import { describe, it, expect, beforeEach } from 'vitest';
import PriorityQueue from './PriorityQueue';

describe('PriorityQueue', () => {
  let queue: PriorityQueue<string>;

  beforeEach(() => {
    queue = new PriorityQueue<string>();
  });

  describe('constructor', () => {
    it('should create an empty queue', () => {
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('should initialize with array of values (default priority 0)', () => {
      const q = new PriorityQueue<string>(['a', 'b', 'c']);
      expect(q.size()).toBe(3);
      expect(q.isEmpty()).toBe(false);
    });

    it('should initialize with array of priority objects', () => {
      const q = new PriorityQueue<string>([
        { value: 'low', priority: 10 },
        { value: 'high', priority: 1 },
        { value: 'medium', priority: 5 },
      ]);
      expect(q.size()).toBe(3);
      expect(q.dequeue()).toBe('high');
      expect(q.dequeue()).toBe('medium');
      expect(q.dequeue()).toBe('low');
    });
  });

  describe('enqueue', () => {
    it('should add items to the queue', () => {
      queue.enqueue('task1', 5);
      expect(queue.size()).toBe(1);
      expect(queue.isEmpty()).toBe(false);
    });

    it('should maintain priority order (lower number = higher priority)', () => {
      queue.enqueue('low', 10);
      queue.enqueue('high', 1);
      queue.enqueue('medium', 5);

      expect(queue.dequeue()).toBe('high');
      expect(queue.dequeue()).toBe('medium');
      expect(queue.dequeue()).toBe('low');
    });

    it('should handle FIFO ordering for equal priorities', () => {
      queue.enqueue('first', 5);
      queue.enqueue('second', 5);
      queue.enqueue('third', 5);

      expect(queue.dequeue()).toBe('first');
      expect(queue.dequeue()).toBe('second');
      expect(queue.dequeue()).toBe('third');
    });

    it('should update existing item when enqueued again', () => {
      queue.enqueue('task', 10);
      queue.enqueue('task', 1);

      expect(queue.size()).toBe(1);
      expect(queue.getPriority('task')).toBe(1);
    });
  });

  describe('dequeue', () => {
    beforeEach(() => {
      queue.enqueue('low', 10);
      queue.enqueue('high', 1);
      queue.enqueue('medium', 5);
    });

    it('should remove and return highest priority item', () => {
      const item = queue.dequeue();
      expect(item).toBe('high');
      expect(queue.size()).toBe(2);
    });

    it('should return undefined when queue is empty', () => {
      const emptyQueue = new PriorityQueue<string>();
      expect(emptyQueue.dequeue()).toBeUndefined();
    });

    it('should maintain order after multiple dequeues', () => {
      expect(queue.dequeue()).toBe('high');
      expect(queue.dequeue()).toBe('medium');
      expect(queue.dequeue()).toBe('low');
      expect(queue.dequeue()).toBeUndefined();
    });
  });

  describe('peek', () => {
    it('should return highest priority item without removing it', () => {
      queue.enqueue('low', 10);
      queue.enqueue('high', 1);

      expect(queue.peek()).toBe('high');
      expect(queue.size()).toBe(2);
    });

    it('should return undefined for empty queue', () => {
      expect(queue.peek()).toBeUndefined();
    });
  });

  describe('peekPriority', () => {
    it('should return priority of next item', () => {
      queue.enqueue('task', 5);
      expect(queue.peekPriority()).toBe(5);
    });

    it('should return undefined for empty queue', () => {
      expect(queue.peekPriority()).toBeUndefined();
    });

    it('should return lowest priority number', () => {
      queue.enqueue('low', 10);
      queue.enqueue('high', 1);
      queue.enqueue('medium', 5);

      expect(queue.peekPriority()).toBe(1);
    });
  });

  describe('contains', () => {
    beforeEach(() => {
      queue.enqueue('task1', 5);
      queue.enqueue('task2', 10);
    });

    it('should return true for existing items', () => {
      expect(queue.contains('task1')).toBe(true);
      expect(queue.contains('task2')).toBe(true);
    });

    it('should return false for non-existing items', () => {
      expect(queue.contains('task3')).toBe(false);
    });

    it('should return false after item is dequeued', () => {
      queue.dequeue();
      expect(queue.contains('task1')).toBe(false);
    });
  });

  describe('getPriority', () => {
    beforeEach(() => {
      queue.enqueue('task1', 5);
      queue.enqueue('task2', 10);
    });

    it('should return priority of existing item', () => {
      expect(queue.getPriority('task1')).toBe(5);
      expect(queue.getPriority('task2')).toBe(10);
    });

    it('should return undefined for non-existing item', () => {
      expect(queue.getPriority('task3')).toBeUndefined();
    });
  });

  describe('size', () => {
    it('should return 0 for empty queue', () => {
      expect(queue.size()).toBe(0);
    });

    it('should return correct size after operations', () => {
      queue.enqueue('task1', 5);
      expect(queue.size()).toBe(1);

      queue.enqueue('task2', 10);
      expect(queue.size()).toBe(2);

      queue.dequeue();
      expect(queue.size()).toBe(1);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty queue', () => {
      expect(queue.isEmpty()).toBe(true);
    });

    it('should return false for non-empty queue', () => {
      queue.enqueue('task', 5);
      expect(queue.isEmpty()).toBe(false);
    });

    it('should return true after clearing queue', () => {
      queue.enqueue('task', 5);
      queue.dequeue();
      expect(queue.isEmpty()).toBe(true);
    });
  });

  describe('clear', () => {
    beforeEach(() => {
      queue.enqueue('task1', 5);
      queue.enqueue('task2', 10);
      queue.enqueue('task3', 1);
    });

    it('should remove all items from queue', () => {
      queue.clear();
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('should allow adding items after clear', () => {
      queue.clear();
      queue.enqueue('new', 5);
      expect(queue.size()).toBe(1);
      expect(queue.peek()).toBe('new');
    });

    it('should clear entryFinder map', () => {
      queue.clear();
      expect(queue.contains('task1')).toBe(false);
      expect(queue.getPriority('task1')).toBeUndefined();
    });
  });

  describe('updatePriority', () => {
    beforeEach(() => {
      queue.enqueue('task1', 10);
      queue.enqueue('task2', 5);
      queue.enqueue('task3', 1);
    });

    it('should update priority of existing item', () => {
      const result = queue.updatePriority('task1', 0);
      expect(result).toBe(true);
      expect(queue.getPriority('task1')).toBe(0);
      expect(queue.peek()).toBe('task1');
    });

    it('should return false for non-existing item', () => {
      const result = queue.updatePriority('nonexistent', 5);
      expect(result).toBe(false);
    });

    it('should maintain queue size after update', () => {
      const sizeBefore = queue.size();
      queue.updatePriority('task2', 20);
      expect(queue.size()).toBe(sizeBefore);
    });

    it('should reorder queue correctly after priority update', () => {
      queue.updatePriority('task1', 0); // Was 10, now highest priority
      expect(queue.dequeue()).toBe('task1');
      expect(queue.dequeue()).toBe('task3');
      expect(queue.dequeue()).toBe('task2');
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      queue.enqueue('task1', 10);
      queue.enqueue('task2', 5);
      queue.enqueue('task3', 1);
    });

    it('should remove existing item', () => {
      const result = queue.remove('task2');
      expect(result).toBe(true);
      expect(queue.size()).toBe(2);
      expect(queue.contains('task2')).toBe(false);
    });

    it('should return false for non-existing item', () => {
      const result = queue.remove('nonexistent');
      expect(result).toBe(false);
    });

    it('should maintain correct order after removal', () => {
      queue.remove('task2');
      expect(queue.dequeue()).toBe('task3');
      expect(queue.dequeue()).toBe('task1');
    });

    it('should remove from entryFinder', () => {
      queue.remove('task1');
      expect(queue.getPriority('task1')).toBeUndefined();
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty queue', () => {
      expect(queue.toArray()).toEqual([]);
    });

    it('should return array of all values', () => {
      queue.enqueue('task1', 5);
      queue.enqueue('task2', 10);
      queue.enqueue('task3', 1);

      const array = queue.toArray();
      expect(array).toHaveLength(3);
      expect(array).toContain('task1');
      expect(array).toContain('task2');
      expect(array).toContain('task3');
    });

    it('should not modify the queue', () => {
      queue.enqueue('task1', 5);
      queue.enqueue('task2', 10);

      const sizeBefore = queue.size();
      queue.toArray();
      expect(queue.size()).toBe(sizeBefore);
    });
  });

  describe('iterator', () => {
    beforeEach(() => {
      queue.enqueue('low', 10);
      queue.enqueue('high', 1);
      queue.enqueue('medium', 5);
    });

    it('should iterate in priority order', () => {
      const items = [...queue];
      expect(items).toEqual(['high', 'medium', 'low']);
    });

    it('should drain the queue', () => {
      [...queue];
      expect(queue.isEmpty()).toBe(true);
      expect(queue.size()).toBe(0);
    });

    it('should work with for...of loop', () => {
      const items: string[] = [];
      for (const item of queue) {
        items.push(item);
      }
      expect(items).toEqual(['high', 'medium', 'low']);
    });
  });

  describe('complex scenarios', () => {
    it('should handle mixed operations correctly', () => {
      queue.enqueue('task1', 5);
      queue.enqueue('task2', 3);
      queue.enqueue('task3', 7);

      expect(queue.dequeue()).toBe('task2');

      queue.enqueue('task4', 1);
      queue.updatePriority('task3', 2);

      expect(queue.dequeue()).toBe('task4');
      expect(queue.dequeue()).toBe('task3');
      expect(queue.dequeue()).toBe('task1');
    });

    it('should handle enqueue of same value multiple times', () => {
      queue.enqueue('task', 10);
      queue.enqueue('task', 5);
      queue.enqueue('task', 1);

      expect(queue.size()).toBe(1);
      expect(queue.getPriority('task')).toBe(1);
    });

    it('should work with different data types', () => {
      const numQueue = new PriorityQueue<number>();
      numQueue.enqueue(100, 10);
      numQueue.enqueue(50, 5);
      numQueue.enqueue(10, 1);

      expect(numQueue.dequeue()).toBe(10);
      expect(numQueue.dequeue()).toBe(50);
      expect(numQueue.dequeue()).toBe(100);
    });

    it('should handle negative priorities', () => {
      queue.enqueue('negative', -5);
      queue.enqueue('positive', 5);
      queue.enqueue('zero', 0);

      expect(queue.dequeue()).toBe('negative');
      expect(queue.dequeue()).toBe('zero');
      expect(queue.dequeue()).toBe('positive');
    });

    it('should maintain FIFO with priority updates', () => {
      queue.enqueue('first', 5);
      queue.enqueue('second', 5);
      queue.updatePriority('first', 5); // Re-enqueue effectively

      // After update, 'first' should have a newer counter
      expect(queue.dequeue()).toBe('second');
      expect(queue.dequeue()).toBe('first');
    });
  });

  describe('edge cases', () => {
    it('should handle single item operations', () => {
      queue.enqueue('only', 5);
      expect(queue.peek()).toBe('only');
      expect(queue.dequeue()).toBe('only');
      expect(queue.isEmpty()).toBe(true);
    });

    it('should handle remove on last item', () => {
      queue.enqueue('only', 5);
      queue.remove('only');
      expect(queue.isEmpty()).toBe(true);
    });

    it('should handle operations on empty queue gracefully', () => {
      expect(queue.dequeue()).toBeUndefined();
      expect(queue.peek()).toBeUndefined();
      expect(queue.peekPriority()).toBeUndefined();
      expect(queue.remove('nonexistent')).toBe(false);
      expect(queue.updatePriority('nonexistent', 5)).toBe(false);
    });

    it('should handle large number of items', () => {
      for (let i = 0; i < 1000; i++) {
        queue.enqueue(`task${i}`, i);
      }
      expect(queue.size()).toBe(1000);
      expect(queue.peek()).toBe('task0');
    });
  });
});
