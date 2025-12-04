import { describe, it, expect, beforeEach } from 'vitest';
import MinHeap from './MinHeap';

describe('MinHeap', () => {
  let heap: MinHeap<number>;

  beforeEach(() => {
    heap = new MinHeap<number>();
  });

  describe('constructor', () => {
    it('should create an empty heap with default comparator', () => {
      expect(heap.size()).toBe(0);
      expect(heap.isEmpty()).toBe(true);
    });

    it('should create an empty heap with custom comparator', () => {
      const customHeap = new MinHeap<number>((a, b) => b - a); // Max heap
      expect(customHeap.size()).toBe(0);
      expect(customHeap.isEmpty()).toBe(true);
    });
  });

  describe('size and isEmpty', () => {
    it('should return correct size after insertions', () => {
      heap.insert(5);
      expect(heap.size()).toBe(1);
      heap.insert(3);
      expect(heap.size()).toBe(2);
      heap.insert(7);
      expect(heap.size()).toBe(3);
    });

    it('should return correct isEmpty status', () => {
      expect(heap.isEmpty()).toBe(true);
      heap.insert(1);
      expect(heap.isEmpty()).toBe(false);
      heap.extractMin();
      expect(heap.isEmpty()).toBe(true);
    });
  });

  describe('insert and peek', () => {
    it('should insert and maintain min at root', () => {
      heap.insert(5);
      expect(heap.peek()).toBe(5);
      heap.insert(3);
      expect(heap.peek()).toBe(3);
      heap.insert(7);
      expect(heap.peek()).toBe(3);
      heap.insert(1);
      expect(heap.peek()).toBe(1);
    });

    it('should handle duplicate values', () => {
      heap.insert(5);
      heap.insert(5);
      heap.insert(5);
      expect(heap.size()).toBe(3);
      expect(heap.peek()).toBe(5);
    });

    it('should return undefined when peeking empty heap', () => {
      expect(heap.peek()).toBeUndefined();
    });
  });

  describe('extractMin', () => {
    it('should extract elements in sorted order', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      heap.insert(1);
      heap.insert(9);

      expect(heap.extractMin()).toBe(1);
      expect(heap.extractMin()).toBe(3);
      expect(heap.extractMin()).toBe(5);
      expect(heap.extractMin()).toBe(7);
      expect(heap.extractMin()).toBe(9);
      expect(heap.extractMin()).toBeUndefined();
    });

    it('should maintain heap property after extraction', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      heap.insert(1);

      heap.extractMin();
      expect(heap.isValid()).toBe(true);
      expect(heap.peek()).toBe(3);
    });

    it('should return undefined for empty heap', () => {
      expect(heap.extractMin()).toBeUndefined();
    });

    it('should handle single element', () => {
      heap.insert(42);
      expect(heap.extractMin()).toBe(42);
      expect(heap.isEmpty()).toBe(true);
    });
  });

  describe('remove', () => {
    it('should remove specific element from heap', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      heap.insert(1);

      expect(heap.remove(3)).toBe(true);
      expect(heap.size()).toBe(3);
      expect(heap.isValid()).toBe(true);
    });

    it('should return false when removing non-existent element', () => {
      heap.insert(5);
      heap.insert(3);
      expect(heap.remove(10)).toBe(false);
      expect(heap.size()).toBe(2);
    });

    it('should remove last element correctly', () => {
      heap.insert(1);
      heap.insert(2);
      heap.insert(3);

      expect(heap.remove(3)).toBe(true);
      expect(heap.size()).toBe(2);
      expect(heap.isValid()).toBe(true);
    });

    it('should remove root element correctly', () => {
      heap.insert(1);
      heap.insert(2);
      heap.insert(3);

      expect(heap.remove(1)).toBe(true);
      expect(heap.peek()).toBe(2);
      expect(heap.isValid()).toBe(true);
    });

    it('should return false when removing from empty heap', () => {
      expect(heap.remove(5)).toBe(false);
    });
  });

  describe('updatePriority', () => {
    it('should update priority and maintain heap property', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);

      expect(heap.updatePriority(7, 1)).toBe(true);
      expect(heap.peek()).toBe(1);
      expect(heap.isValid()).toBe(true);
    });

    it('should handle priority increase', () => {
      heap.insert(1);
      heap.insert(2);
      heap.insert(3);

      expect(heap.updatePriority(1, 10)).toBe(true);
      expect(heap.peek()).toBe(2);
      expect(heap.isValid()).toBe(true);
    });

    it('should return false for non-existent element', () => {
      heap.insert(5);
      expect(heap.updatePriority(10, 1)).toBe(false);
    });

    it('should handle same priority update', () => {
      heap.insert(5);
      expect(heap.updatePriority(5, 5)).toBe(true);
      expect(heap.peek()).toBe(5);
    });
  });

  describe('buildHeap', () => {
    it('should build heap from array', () => {
      heap.buildHeap([9, 5, 7, 1, 3, 8, 2]);
      expect(heap.size()).toBe(7);
      expect(heap.peek()).toBe(1);
      expect(heap.isValid()).toBe(true);
    });

    it('should handle empty array', () => {
      heap.buildHeap([]);
      expect(heap.isEmpty()).toBe(true);
    });

    it('should handle single element array', () => {
      heap.buildHeap([42]);
      expect(heap.peek()).toBe(42);
      expect(heap.size()).toBe(1);
    });

    it('should replace existing heap', () => {
      heap.insert(100);
      heap.insert(200);
      heap.buildHeap([1, 2, 3]);
      expect(heap.size()).toBe(3);
      expect(heap.peek()).toBe(1);
    });
  });

  describe('clear', () => {
    it('should clear all elements', () => {
      heap.insert(1);
      heap.insert(2);
      heap.insert(3);
      heap.clear();
      expect(heap.isEmpty()).toBe(true);
      expect(heap.size()).toBe(0);
      expect(heap.peek()).toBeUndefined();
    });
  });

  describe('toArray', () => {
    it('should return array representation of heap', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      const arr = heap.toArray();
      expect(arr.length).toBe(3);
      expect(arr).toContain(3);
      expect(arr).toContain(5);
      expect(arr).toContain(7);
    });

    it('should return empty array for empty heap', () => {
      expect(heap.toArray()).toEqual([]);
    });
  });

  describe('isValid', () => {
    it('should validate correct heap structure', () => {
      heap.insert(1);
      heap.insert(2);
      heap.insert(3);
      heap.insert(4);
      expect(heap.isValid()).toBe(true);
    });

    it('should return true for empty heap', () => {
      expect(heap.isValid()).toBe(true);
    });
  });

  describe('iterator', () => {
    it('should iterate in sorted order', () => {
      heap.insert(5);
      heap.insert(3);
      heap.insert(7);
      heap.insert(1);
      heap.insert(9);

      const result = [...heap];
      expect(result).toEqual([1, 3, 5, 7, 9]);
    });

    it('should handle empty heap iteration', () => {
      const result = [...heap];
      expect(result).toEqual([]);
    });

    it('should drain the heap during iteration', () => {
      heap.insert(1);
      heap.insert(2);
      const result = [...heap];
      expect(result.length).toBe(2);
      expect(heap.isEmpty()).toBe(true);
    });
  });

  describe('custom comparator', () => {
    let maxHeap: MinHeap<number>;

    beforeEach(() => {
      maxHeap = new MinHeap<number>((a, b) => b - a);
    });

    it('should work as max heap with reverse comparator', () => {
      maxHeap.insert(5);
      maxHeap.insert(3);
      maxHeap.insert(7);
      maxHeap.insert(1);

      expect(maxHeap.extractMin()).toBe(7);
      expect(maxHeap.extractMin()).toBe(5);
      expect(maxHeap.extractMin()).toBe(3);
      expect(maxHeap.extractMin()).toBe(1);
    });
  });

  describe('string heap', () => {
    let stringHeap: MinHeap<string>;

    beforeEach(() => {
      stringHeap = new MinHeap<string>();
    });

    it('should handle string elements', () => {
      stringHeap.insert('banana');
      stringHeap.insert('apple');
      stringHeap.insert('cherry');

      expect(stringHeap.peek()).toBe('apple');
      expect(stringHeap.extractMin()).toBe('apple');
      expect(stringHeap.extractMin()).toBe('banana');
      expect(stringHeap.extractMin()).toBe('cherry');
    });
  });

  describe('object heap', () => {
    interface Task {
      priority: number;
      name: string;
    }

    let taskHeap: MinHeap<Task>;

    beforeEach(() => {
      taskHeap = new MinHeap<Task>((a, b) => a.priority - b.priority);
    });

    it('should handle object elements with custom comparator', () => {
      const task1 = { priority: 3, name: 'Task 1' };
      const task2 = { priority: 1, name: 'Task 2' };
      const task3 = { priority: 2, name: 'Task 3' };

      taskHeap.insert(task1);
      taskHeap.insert(task2);
      taskHeap.insert(task3);

      expect(taskHeap.peek()).toBe(task2);
      expect(taskHeap.extractMin()?.name).toBe('Task 2');
      expect(taskHeap.extractMin()?.name).toBe('Task 3');
      expect(taskHeap.extractMin()?.name).toBe('Task 1');
    });

    it('should support remove with object references', () => {
      const task1 = { priority: 3, name: 'Task 1' };
      const task2 = { priority: 1, name: 'Task 2' };

      taskHeap.insert(task1);
      taskHeap.insert(task2);

      expect(taskHeap.remove(task1)).toBe(true);
      expect(taskHeap.size()).toBe(1);
      expect(taskHeap.peek()).toBe(task2);
    });

    it('should support updatePriority with object references', () => {
      const task1 = { priority: 3, name: 'Task 1' };
      const task2 = { priority: 1, name: 'Task 2' };

      taskHeap.insert(task1);
      taskHeap.insert(task2);

      const updatedTask1 = { priority: 0, name: 'Task 1' };
      expect(taskHeap.updatePriority(task1, updatedTask1)).toBe(true);
      expect(taskHeap.peek()).toBe(updatedTask1);
    });
  });

  describe('edge cases', () => {
    it('should handle large number of elements', () => {
      for (let i = 1000; i > 0; i--) {
        heap.insert(i);
      }
      expect(heap.size()).toBe(1000);
      expect(heap.peek()).toBe(1);
      expect(heap.isValid()).toBe(true);
    });

    it('should handle negative numbers', () => {
      heap.insert(-5);
      heap.insert(-10);
      heap.insert(-1);
      expect(heap.peek()).toBe(-10);
    });

    it('should handle all same values', () => {
      heap.insert(5);
      heap.insert(5);
      heap.insert(5);
      expect(heap.size()).toBe(3);
      expect(heap.extractMin()).toBe(5);
      expect(heap.extractMin()).toBe(5);
      expect(heap.extractMin()).toBe(5);
    });
  });
});
