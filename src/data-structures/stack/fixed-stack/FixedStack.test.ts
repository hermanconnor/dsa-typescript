import { describe, it, expect, beforeEach, vi } from 'vitest';
import FixedStack from './FixedStack';

describe('FixedStack', () => {
  let stack: FixedStack<number>;

  beforeEach(() => {
    stack = new FixedStack<number>(5);
  });

  describe('constructor', () => {
    it('should create an empty stack with specified capacity', () => {
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
      expect(stack.capacity()).toBe(5);
    });

    it('should throw error for zero capacity', () => {
      expect(() => new FixedStack<number>(0)).toThrow(
        'Capacity must be a positive integer',
      );
    });

    it('should throw error for negative capacity', () => {
      expect(() => new FixedStack<number>(-5)).toThrow(
        'Capacity must be a positive integer',
      );
    });

    it('should throw error for non-integer capacity', () => {
      expect(() => new FixedStack<number>(3.5)).toThrow(
        'Capacity must be a positive integer',
      );
    });

    it('should create stack with capacity of 1', () => {
      const smallStack = new FixedStack<number>(1);

      expect(smallStack.capacity()).toBe(1);

      smallStack.push(1);
      expect(smallStack.isFull()).toBe(true);
    });
  });

  describe('push', () => {
    it('should add a single element to the stack', () => {
      stack.push(1);

      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(1);
    });

    it('should add multiple elements up to capacity', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.size()).toBe(3);
      expect(stack.peek()).toBe(3);
    });

    it('should throw error when pushing to full stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);

      expect(() => stack.push(6)).toThrow('Stack overflow');
    });

    it('should maintain LIFO order', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
    });

    it('should handle pushing null values', () => {
      const nullStack = new FixedStack<number | null>(3);

      nullStack.push(null);

      expect(nullStack.size()).toBe(1);
      expect(nullStack.peek()).toBe(null);
    });

    it('should handle pushing undefined values', () => {
      const undefinedStack = new FixedStack<number | undefined>(3);

      undefinedStack.push(undefined);

      expect(undefinedStack.size()).toBe(1);
      expect(undefinedStack.peek()).toBe(undefined);
    });
  });

  describe('pop', () => {
    it('should return undefined when popping from empty stack', () => {
      expect(stack.pop()).toBe(undefined);
    });

    it('should remove and return the top element', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.pop()).toBe(2);
      expect(stack.size()).toBe(1);
    });

    it('should allow pushing after popping from full stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);

      stack.pop();
      expect(stack.isFull()).toBe(false);

      stack.push(6); // Should not throw
      expect(stack.peek()).toBe(6);
    });

    it('should handle multiple consecutive pops', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.pop()).toBe(3);
      expect(stack.pop()).toBe(2);
      expect(stack.pop()).toBe(1);
      expect(stack.pop()).toBe(undefined);
    });
  });

  describe('peek', () => {
    it('should return undefined for empty stack', () => {
      expect(stack.peek()).toBe(undefined);
    });

    it('should return the top element without removing it', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.peek()).toBe(2);
      expect(stack.size()).toBe(2);
    });

    it('should return the same element on multiple peeks', () => {
      stack.push(42);

      expect(stack.peek()).toBe(42);
      expect(stack.peek()).toBe(42);
      expect(stack.peek()).toBe(42);
    });
  });

  describe('isEmpty', () => {
    it('should return true for new stack', () => {
      expect(stack.isEmpty()).toBe(true);
    });

    it('should return false after pushing elements', () => {
      stack.push(1);

      expect(stack.isEmpty()).toBe(false);
    });

    it('should return true after clearing all elements', () => {
      stack.push(1);
      stack.push(2);
      stack.pop();
      stack.pop();

      expect(stack.isEmpty()).toBe(true);
    });
  });

  describe('isFull', () => {
    it('should return false for new stack', () => {
      expect(stack.isFull()).toBe(false);
    });

    it('should return false for partially filled stack', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.isFull()).toBe(false);
    });

    it('should return true when stack reaches capacity', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);

      expect(stack.isFull()).toBe(true);
    });

    it('should return false after popping from full stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);
      stack.pop();

      expect(stack.isFull()).toBe(false);
    });
  });

  describe('size', () => {
    it('should return 0 for empty stack', () => {
      expect(stack.size()).toBe(0);
    });

    it('should increment with each push', () => {
      stack.push(1);

      expect(stack.size()).toBe(1);

      stack.push(2);
      expect(stack.size()).toBe(2);

      stack.push(3);
      expect(stack.size()).toBe(3);
    });

    it('should decrement with each pop', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.pop();

      expect(stack.size()).toBe(2);

      stack.pop();
      expect(stack.size()).toBe(1);
    });

    it('should not exceed capacity', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);

      expect(stack.size()).toBe(5);
      expect(stack.size()).toBe(stack.capacity());
    });
  });

  describe('capacity', () => {
    it('should return the initial capacity', () => {
      expect(stack.capacity()).toBe(5);
    });

    it('should not change after operations', () => {
      stack.push(1);
      stack.push(2);
      stack.pop();

      expect(stack.capacity()).toBe(5);
    });
  });

  describe('remaining', () => {
    it('should return full capacity for empty stack', () => {
      expect(stack.remaining()).toBe(5);
    });

    it('should return correct remaining capacity', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.remaining()).toBe(3);
    });

    it('should return 0 for full stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);

      expect(stack.remaining()).toBe(0);
    });
  });

  describe('clear', () => {
    it('should clear an empty stack', () => {
      stack.clear();

      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });

    it('should remove all elements from stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.clear();

      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
      expect(stack.peek()).toBe(undefined);
    });

    it('should maintain capacity after clear', () => {
      stack.push(1);
      stack.push(2);
      stack.clear();

      expect(stack.capacity()).toBe(5);
    });

    it('should allow pushing to full capacity after clear', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);
      stack.clear();

      stack.push(6);
      stack.push(7);
      stack.push(8);
      stack.push(9);
      stack.push(10);

      expect(stack.isFull()).toBe(true);
    });
  });

  describe('contains', () => {
    it('should return false for empty stack', () => {
      expect(stack.contains(1)).toBe(false);
    });

    it('should return true for existing element', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.contains(2)).toBe(true);
    });

    it('should return false for non-existing element', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.contains(3)).toBe(false);
    });

    it('should find element at top of stack', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.contains(2)).toBe(true);
    });

    it('should find element at bottom of stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.contains(1)).toBe(true);
    });
  });

  describe('search', () => {
    it('should return -1 for empty stack', () => {
      expect(stack.search(1)).toBe(-1);
    });

    it('should return 0 for top element', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.search(3)).toBe(0);
    });

    it('should return correct distance from top', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.search(2)).toBe(1);
      expect(stack.search(1)).toBe(2);
    });

    it('should return -1 for non-existing element', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.search(5)).toBe(-1);
    });
  });

  describe('iterator', () => {
    it('should iterate over empty stack', () => {
      const elements = [...stack];

      expect(elements).toEqual([]);
    });

    it('should iterate from top to bottom', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      const elements = [...stack];

      expect(elements).toEqual([3, 2, 1]);
    });

    it('should work with for...of loop', () => {
      stack.push(10);
      stack.push(20);
      stack.push(30);

      const collected: number[] = [];
      for (const element of stack) {
        collected.push(element);
      }

      expect(collected).toEqual([30, 20, 10]);
    });

    it('should correctly handle undefined values', () => {
      const undefinedStack = new FixedStack<number | undefined>(3);

      undefinedStack.push(1);
      undefinedStack.push(undefined);
      undefinedStack.push(3);
      const elements = [...undefinedStack];

      expect(elements).toEqual([3, undefined, 1]);
    });
  });

  describe('toArray', () => {
    it('should return empty array for empty stack', () => {
      expect(stack.toArray()).toEqual([]);
    });

    it('should return array with elements in top-to-bottom order', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.toArray()).toEqual([3, 2, 1]);
    });

    it('should not modify the original stack', () => {
      stack.push(1);
      stack.push(2);

      const arr = stack.toArray();
      arr.push(3);

      expect(stack.size()).toBe(2);
    });
  });

  describe('toString', () => {
    it('should return [EMPTY] for empty stack', () => {
      expect(stack.toString()).toBe('[EMPTY]');
    });

    it('should format single element stack', () => {
      stack.push(1);

      expect(stack.toString()).toBe('[TOP] 1 [BOTTOM]');
    });

    it('should format multiple element stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.toString()).toBe('[TOP] 3 -> 2 -> 1 [BOTTOM]');
    });

    it('should handle different data types', () => {
      const stringStack = new FixedStack<string>(3);

      stringStack.push('a');
      stringStack.push('b');

      expect(stringStack.toString()).toBe('[TOP] b -> a [BOTTOM]');
    });
  });

  describe('clone', () => {
    it('should clone empty stack', () => {
      const cloned = stack.clone();

      expect(cloned.isEmpty()).toBe(true);
      expect(cloned.size()).toBe(0);
      expect(cloned.capacity()).toBe(5);
    });

    it('should create independent copy', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      const cloned = stack.clone();

      expect(cloned.size()).toBe(3);
      expect(cloned.capacity()).toBe(5);
      expect(cloned.toArray()).toEqual([3, 2, 1]);

      stack.pop();

      expect(stack.size()).toBe(2);
      expect(cloned.size()).toBe(3);
    });

    it('should maintain correct order', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      const cloned = stack.clone();

      expect(cloned.pop()).toBe(3);
      expect(cloned.pop()).toBe(2);
      expect(cloned.pop()).toBe(1);
    });

    it('should preserve capacity', () => {
      stack.push(1);

      const cloned = stack.clone();

      cloned.push(2);
      cloned.push(3);
      cloned.push(4);
      cloned.push(5);
      expect(cloned.isFull()).toBe(true);
    });
  });

  describe('forEach', () => {
    it('should not call callback for empty stack', () => {
      const callback = vi.fn();

      stack.forEach(callback);

      expect(callback).not.toHaveBeenCalled();
    });

    it('should call callback for each element', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      const elements: number[] = [];
      const indices: number[] = [];

      stack.forEach((element, index) => {
        elements.push(element);
        indices.push(index);
      });

      expect(elements).toEqual([3, 2, 1]);
      expect(indices).toEqual([0, 1, 2]);
    });
  });

  describe('pushMany', () => {
    it('should push all elements if space available', () => {
      const count = stack.pushMany([1, 2, 3]);

      expect(count).toBe(3);
      expect(stack.size()).toBe(3);
      expect(stack.toArray()).toEqual([3, 2, 1]);
    });

    it('should stop when stack becomes full', () => {
      stack.push(1);
      stack.push(2);

      const count = stack.pushMany([3, 4, 5, 6, 7]);

      expect(count).toBe(3);
      expect(stack.isFull()).toBe(true);
    });

    it('should return 0 for full stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);

      const count = stack.pushMany([6, 7]);

      expect(count).toBe(0);
    });

    it('should handle empty array', () => {
      const count = stack.pushMany([]);

      expect(count).toBe(0);
      expect(stack.isEmpty()).toBe(true);
    });
  });

  describe('utilization', () => {
    it('should return 0 for empty stack', () => {
      expect(stack.utilization()).toBe(0);
    });

    it('should return 100 for full stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);

      expect(stack.utilization()).toBe(100);
    });

    it('should return correct percentage', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.utilization()).toBe(60);
    });

    it('should update after operations', () => {
      stack.push(1);
      stack.push(2);

      expect(stack.utilization()).toBe(40);

      stack.pop();
      expect(stack.utilization()).toBe(20);
    });
  });

  describe('complex scenarios', () => {
    it('should handle fill, empty, refill pattern', () => {
      // Fill
      for (let i = 1; i <= 5; i++) {
        stack.push(i);
      }

      expect(stack.isFull()).toBe(true);

      // Empty
      for (let i = 0; i < 5; i++) {
        stack.pop();
      }

      expect(stack.isEmpty()).toBe(true);

      // Refill
      for (let i = 6; i <= 10; i++) {
        stack.push(i);
      }

      expect(stack.isFull()).toBe(true);
      expect(stack.peek()).toBe(10);
    });

    it('should work with different data types', () => {
      const stringStack = new FixedStack<string>(3);

      stringStack.push('hello');
      stringStack.push('world');

      expect(stringStack.pop()).toBe('world');
      expect(stringStack.peek()).toBe('hello');
    });

    it('should handle object elements', () => {
      const objStack = new FixedStack<{ id: number; name: string }>(3);

      const obj1 = { id: 1, name: 'Alice' };
      const obj2 = { id: 2, name: 'Bob' };

      objStack.push(obj1);
      objStack.push(obj2);

      expect(objStack.pop()).toBe(obj2);
      expect(objStack.peek()).toBe(obj1);
    });

    it('should maintain capacity constraint through operations', () => {
      const smallStack = new FixedStack<number>(2);

      smallStack.push(1);
      smallStack.push(2);

      expect(() => smallStack.push(3)).toThrow();

      smallStack.pop();
      smallStack.push(3); // Should work now

      expect(smallStack.peek()).toBe(3);
    });

    it('should handle alternating push and pop at capacity boundary', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);
      stack.push(4);
      stack.push(5);

      expect(stack.isFull()).toBe(true);
      stack.pop();
      expect(stack.isFull()).toBe(false);
      stack.push(6);
      expect(stack.isFull()).toBe(true);
      expect(stack.peek()).toBe(6);
    });
  });
});
