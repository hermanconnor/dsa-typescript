import { beforeEach, describe, expect, it } from 'vitest';
import Stack from '../src/stack/Stack';

describe('Stack', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack();
  });

  it('should initially be empty', () => {
    expect(stack.isEmpty).toBe(true);
    expect(stack.size).toBe(0);
  });

  it('push should add an item onto the stack', () => {
    stack.push(10);
    stack.push(20);
    stack.push(30);

    expect(stack.size).toBe(3);
    expect(stack.peek()).toBe(30);
  });

  it('pop should remove and return the top item in the stack', () => {
    stack.push(10);
    stack.push(20);
    stack.push(30);

    const poppedItem = stack.pop();

    expect(poppedItem).toBe(30);
    expect(stack.size).toBe(2);
  });

  it('pop should return undefined if the stack is empty', () => {
    expect(stack.pop()).toBeUndefined();
  });
});
