import { describe, it, expect, beforeEach } from 'vitest';
import MaxHeap from './MaxHeap';

describe('MaxHeap', () => {
  let emptyHeap: MaxHeap<number>;
  let smallHeap: MaxHeap<number>;
  let mediumHeap: MaxHeap<number>;

  beforeEach(() => {
    // Empty heap
    emptyHeap = new MaxHeap<number>();

    // Small heap with a few elements
    smallHeap = new MaxHeap<number>();
    [5, 10, 3].forEach((v) => smallHeap.insert(v));

    // Medium heap with more elements
    mediumHeap = new MaxHeap<number>();
    [15, 10, 20, 8, 25, 30, 5].forEach((v) => mediumHeap.insert(v));
  });

  describe('Constructor and Basic Operations', () => {
    it('should create an empty heap', () => {
      expect(emptyHeap.isEmpty()).toBe(true);
      expect(emptyHeap.size()).toBe(0);
    });

    it('should accept a custom compare function', () => {
      const minHeap = new MaxHeap<number>((a, b) => b - a); // Min heap behavior
      minHeap.insert(5);
      minHeap.insert(10);
      minHeap.insert(3);
      expect(minHeap.peekMax()).toBe(3); // Smallest value is "max" with reversed comparator
    });

    it('should handle string comparison', () => {
      const stringHeap = new MaxHeap<string>();
      stringHeap.insert('banana');
      stringHeap.insert('apple');
      stringHeap.insert('cherry');
      expect(stringHeap.peekMax()).toBe('cherry');
    });
  });

  describe('insert()', () => {
    it('should insert elements and maintain max heap property', () => {
      emptyHeap.insert(5);
      emptyHeap.insert(3);
      emptyHeap.insert(7);
      emptyHeap.insert(1);

      expect(emptyHeap.size()).toBe(4);
      expect(emptyHeap.peekMax()).toBe(7);
      expect(emptyHeap.isValid()).toBe(true);
    });

    it('should handle duplicate values', () => {
      emptyHeap.insert(5);
      emptyHeap.insert(5);
      emptyHeap.insert(5);

      expect(emptyHeap.size()).toBe(3);
      expect(emptyHeap.peekMax()).toBe(5);
    });

    it('should insert in ascending order', () => {
      for (let i = 1; i <= 10; i++) {
        emptyHeap.insert(i);
      }

      expect(emptyHeap.peekMax()).toBe(10);
      expect(emptyHeap.isValid()).toBe(true);
    });

    it('should insert in descending order', () => {
      for (let i = 10; i >= 1; i--) {
        emptyHeap.insert(i);
      }

      expect(emptyHeap.peekMax()).toBe(10);
      expect(emptyHeap.isValid()).toBe(true);
    });
  });

  describe('peekMax()', () => {
    it('should return undefined for empty heap', () => {
      expect(emptyHeap.peekMax()).toBeUndefined();
    });

    it('should return max element without removing it', () => {
      expect(smallHeap.peekMax()).toBe(10);
      expect(smallHeap.size()).toBe(3); // Size unchanged
      expect(smallHeap.peekMax()).toBe(10); // Still returns same value
    });
  });

  describe('extractMax()', () => {
    it('should return undefined for empty heap', () => {
      expect(emptyHeap.extractMax()).toBeUndefined();
    });

    it('should extract and remove the max element', () => {
      expect(smallHeap.extractMax()).toBe(10);
      expect(smallHeap.size()).toBe(2);
      expect(smallHeap.peekMax()).toBe(5);
    });

    it('should maintain heap property after multiple extractions', () => {
      const extracted: number[] = [];
      while (!mediumHeap.isEmpty()) {
        extracted.push(mediumHeap.extractMax()!);
        expect(mediumHeap.isValid()).toBe(true);
      }

      expect(extracted).toEqual([30, 25, 20, 15, 10, 8, 5]);
    });

    it('should handle extracting single element', () => {
      emptyHeap.insert(42);

      expect(emptyHeap.extractMax()).toBe(42);
      expect(emptyHeap.isEmpty()).toBe(true);
    });
  });

  describe('remove()', () => {
    it('should return false when removing non-existent element', () => {
      expect(smallHeap.remove(15)).toBe(false);
      expect(smallHeap.size()).toBe(3);
    });

    it('should remove element from middle of heap', () => {
      expect(smallHeap.remove(5)).toBe(true);
      expect(smallHeap.size()).toBe(2);
      expect(smallHeap.isValid()).toBe(true);
    });

    it('should remove the max element', () => {
      expect(smallHeap.remove(10)).toBe(true);
      expect(smallHeap.peekMax()).toBe(5);
      expect(smallHeap.isValid()).toBe(true);
    });

    it('should remove the last element', () => {
      const initialSize = mediumHeap.size();
      expect(mediumHeap.remove(5)).toBe(true);
      expect(mediumHeap.size()).toBe(initialSize - 1);
      expect(mediumHeap.isValid()).toBe(true);
    });

    it('should handle removing all elements one by one', () => {
      const values = [5, 10, 3];
      values.forEach((v) => {
        expect(smallHeap.remove(v)).toBe(true);
        expect(smallHeap.isValid()).toBe(true);
      });

      expect(smallHeap.isEmpty()).toBe(true);
    });
  });

  describe('updatePriority()', () => {
    it('should return false for non-existent element', () => {
      expect(smallHeap.updatePriority(100, 150)).toBe(false);
    });

    it('should update priority to a higher value', () => {
      expect(smallHeap.updatePriority(5, 20)).toBe(true);
      expect(smallHeap.peekMax()).toBe(20);
      expect(smallHeap.isValid()).toBe(true);
    });

    it('should update priority to a lower value', () => {
      expect(smallHeap.updatePriority(10, 1)).toBe(true);
      expect(smallHeap.peekMax()).toBe(5);
      expect(smallHeap.isValid()).toBe(true);
    });

    it('should handle updating to same value', () => {
      expect(smallHeap.updatePriority(10, 10)).toBe(true);
      expect(smallHeap.size()).toBe(3);
      expect(smallHeap.peekMax()).toBe(10);
    });

    it('should maintain heap property after multiple updates', () => {
      mediumHeap.updatePriority(5, 35);
      expect(mediumHeap.isValid()).toBe(true);
      expect(mediumHeap.peekMax()).toBe(35);

      mediumHeap.updatePriority(35, 1);
      expect(mediumHeap.isValid()).toBe(true);
      expect(mediumHeap.peekMax()).toBe(30);
    });
  });

  describe('buildHeap()', () => {
    it('should build heap from empty array', () => {
      emptyHeap.buildHeap([]);
      expect(emptyHeap.isEmpty()).toBe(true);
    });

    it('should build heap from unsorted array', () => {
      emptyHeap.buildHeap([3, 1, 4, 1, 5, 9, 2, 6]);
      expect(emptyHeap.peekMax()).toBe(9);
      expect(emptyHeap.isValid()).toBe(true);
    });

    it('should build heap from sorted array', () => {
      emptyHeap.buildHeap([1, 2, 3, 4, 5]);
      expect(emptyHeap.peekMax()).toBe(5);
      expect(emptyHeap.isValid()).toBe(true);
    });

    it('should replace existing heap', () => {
      smallHeap.buildHeap([1, 2, 3]);
      expect(smallHeap.size()).toBe(3);
      expect(smallHeap.peekMax()).toBe(3);
    });
  });

  describe('clear()', () => {
    it('should clear empty heap', () => {
      emptyHeap.clear();
      expect(emptyHeap.isEmpty()).toBe(true);
    });

    it('should clear non-empty heap', () => {
      smallHeap.clear();
      expect(smallHeap.isEmpty()).toBe(true);
      expect(smallHeap.size()).toBe(0);
      expect(smallHeap.peekMax()).toBeUndefined();
    });
  });

  describe('toArray()', () => {
    it('should return empty array for empty heap', () => {
      expect(emptyHeap.toArray()).toEqual([]);
    });

    it('should return copy of heap array', () => {
      const arr = smallHeap.toArray();
      expect(arr.length).toBe(3);

      // Modifying returned array shouldn't affect heap
      smallHeap.insert(9);
      expect(arr.length).toBe(3);
      expect(smallHeap.size()).toBe(4);
    });
  });

  describe('isValid()', () => {
    it('should return true for empty heap', () => {
      expect(emptyHeap.isValid()).toBe(true);
    });

    it('should return true for single element', () => {
      emptyHeap.insert(42);
      expect(emptyHeap.isValid()).toBe(true);
    });

    it('should return true after various operations', () => {
      expect(mediumHeap.isValid()).toBe(true);

      mediumHeap.extractMax();
      expect(mediumHeap.isValid()).toBe(true);

      mediumHeap.remove(5);
      expect(mediumHeap.isValid()).toBe(true);

      mediumHeap.updatePriority(10, 25);
      expect(mediumHeap.isValid()).toBe(true);
    });
  });

  describe('Iterator', () => {
    it('should iterate over empty heap', () => {
      const values = [...emptyHeap];
      expect(values).toEqual([]);
    });

    it('should iterate in descending order and drain heap', () => {
      emptyHeap.buildHeap([3, 1, 4, 1, 5, 9, 2, 6]);
      const values = [...emptyHeap];

      expect(values).toEqual([9, 6, 5, 4, 3, 2, 1, 1]);
      expect(emptyHeap.isEmpty()).toBe(true);
    });

    it('should work with for...of loop', () => {
      const values: number[] = [];
      for (const value of smallHeap) {
        values.push(value);
      }

      expect(values).toEqual([10, 5, 3]);
    });
  });

  describe('Complex Object Types', () => {
    interface Task {
      id: number;
      priority: number;
      name: string;
    }

    it('should work with custom objects', () => {
      const heap = new MaxHeap<Task>((a, b) => a.priority - b.priority);

      const task1: Task = { id: 1, priority: 5, name: 'Low' };
      const task2: Task = { id: 2, priority: 10, name: 'High' };
      const task3: Task = { id: 3, priority: 7, name: 'Medium' };

      heap.insert(task1);
      heap.insert(task2);
      heap.insert(task3);

      expect(heap.peekMax()?.name).toBe('High');
      expect(heap.extractMax()?.name).toBe('High');
      expect(heap.peekMax()?.name).toBe('Medium');
    });

    it('should support remove and update with object references', () => {
      const heap = new MaxHeap<Task>((a, b) => a.priority - b.priority);

      const task1: Task = { id: 1, priority: 5, name: 'Task1' };
      const task2: Task = { id: 2, priority: 10, name: 'Task2' };

      heap.insert(task1);
      heap.insert(task2);

      expect(heap.remove(task1)).toBe(true);
      expect(heap.size()).toBe(1);

      const updatedTask2: Task = { id: 2, priority: 3, name: 'Task2' };
      heap.updatePriority(task2, updatedTask2);
      expect(heap.peekMax()?.priority).toBe(3);
    });
  });

  describe('Edge Cases and Stress Tests', () => {
    it('should handle large number of elements', () => {
      const n = 1000;

      for (let i = 0; i < n; i++) {
        emptyHeap.insert(Math.floor(Math.random() * 1000));
      }

      expect(emptyHeap.size()).toBe(n);
      expect(emptyHeap.isValid()).toBe(true);

      let prev = Infinity;
      while (!emptyHeap.isEmpty()) {
        const current = emptyHeap.extractMax()!;
        expect(current).toBeLessThanOrEqual(prev);
        prev = current;
      }
    });

    it('should handle alternating insert and extract', () => {
      for (let i = 0; i < 100; i++) {
        emptyHeap.insert(i);
        if (i % 3 === 0 && !emptyHeap.isEmpty()) {
          emptyHeap.extractMax();
        }
      }

      expect(emptyHeap.isValid()).toBe(true);
    });

    it('should handle negative numbers', () => {
      [-5, -1, -10, -3, -7].forEach((v) => emptyHeap.insert(v));

      expect(emptyHeap.peekMax()).toBe(-1);
      expect(emptyHeap.extractMax()).toBe(-1);
      expect(emptyHeap.extractMax()).toBe(-3);
    });

    it('should handle zero', () => {
      [0, -1, 1, 0, 2].forEach((v) => emptyHeap.insert(v));

      expect(emptyHeap.peekMax()).toBe(2);
      expect(emptyHeap.isValid()).toBe(true);
    });
  });
});
