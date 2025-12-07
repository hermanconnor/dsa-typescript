import { beforeEach, describe, expect, it, vi } from 'vitest';
import LinkedListStack from './LinkedListStack';

describe('LinkedListStack', () => {
  let stack: LinkedListStack<number>;

  beforeEach(() => {
    stack = new LinkedListStack<number>();
  });

  describe('constructor', () => {
    it('should create an empty stack', () => {
      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
    });
  });

  describe('push', () => {
    it('should add a single element to the stack', () => {
      stack.push(1);

      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(1);
    });

    it('should add multiple elements to the stack', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      expect(stack.size()).toBe(3);
      expect(stack.peek()).toBe(3);
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
      const nullStack = new LinkedListStack<number | null>();
      nullStack.push(null);

      expect(nullStack.size()).toBe(1);
      expect(nullStack.peek()).toBe(null);
    });

    it('should handle pushing undefined values', () => {
      const undefinedStack = new LinkedListStack<number | undefined>();
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

    it('should empty the stack when popping all elements', () => {
      stack.push(1);
      stack.push(2);
      stack.pop();
      stack.pop();

      expect(stack.isEmpty()).toBe(true);
      expect(stack.size()).toBe(0);
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

    it('should maintain correct count through mixed operations', () => {
      stack.push(1);
      stack.push(2);
      stack.pop();
      stack.push(3);
      stack.push(4);
      stack.pop();

      expect(stack.size()).toBe(2);
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

    it('should allow pushing after clear', () => {
      stack.push(1);
      stack.clear();
      stack.push(2);

      expect(stack.size()).toBe(1);
      expect(stack.peek()).toBe(2);
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
      const stringStack = new LinkedListStack<string>();

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
    });

    it('should create independent copy', () => {
      stack.push(1);
      stack.push(2);
      stack.push(3);

      const cloned = stack.clone();

      expect(cloned.size()).toBe(3);
      expect(cloned.toArray()).toEqual([3, 2, 1]);

      // Modify original
      stack.pop();

      expect(stack.size()).toBe(2);
      expect(cloned.size()).toBe(3); // Clone should be unaffected
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

    it('should create shallow copy for reference types', () => {
      const objStack = new LinkedListStack<{ value: number }>();
      const obj1 = { value: 1 };
      const obj2 = { value: 2 };
      objStack.push(obj1);
      objStack.push(obj2);

      const cloned = objStack.clone();
      const clonedObj = cloned.pop();

      // Shallow copy - same reference
      expect(clonedObj).toBe(obj2);
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

    it('should iterate from top to bottom', () => {
      stack.push(10);
      stack.push(20);
      stack.push(30);

      const collected: number[] = [];
      stack.forEach((element) => {
        collected.push(element);
      });

      expect(collected).toEqual([30, 20, 10]);
    });
  });

  describe('complex scenarios', () => {
    it('should handle alternating push and pop operations', () => {
      stack.push(1);

      expect(stack.pop()).toBe(1);

      stack.push(2);
      stack.push(3);

      expect(stack.pop()).toBe(3);

      stack.push(4);

      expect(stack.size()).toBe(2);
      expect(stack.toArray()).toEqual([4, 2]);
    });

    it('should work with different data types', () => {
      const stringStack = new LinkedListStack<string>();

      stringStack.push('hello');
      stringStack.push('world');

      expect(stringStack.pop()).toBe('world');
      expect(stringStack.peek()).toBe('hello');
    });

    it('should handle object elements', () => {
      const objStack = new LinkedListStack<{ id: number; name: string }>();
      const obj1 = { id: 1, name: 'Alice' };
      const obj2 = { id: 2, name: 'Bob' };

      objStack.push(obj1);
      objStack.push(obj2);

      expect(objStack.pop()).toBe(obj2);
      expect(objStack.peek()).toBe(obj1);
    });

    it('should handle large number of elements', () => {
      const largeStack = new LinkedListStack<number>();
      const count = 1000;

      for (let i = 0; i < count; i++) {
        largeStack.push(i);
      }

      expect(largeStack.size()).toBe(count);

      for (let i = count - 1; i >= 0; i--) {
        expect(largeStack.pop()).toBe(i);
      }

      expect(largeStack.isEmpty()).toBe(true);
    });
  });
});
