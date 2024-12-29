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

  it('pop should throw an error if the stack is empty', () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it('pop should remove and return the top item in the stack', () => {
    stack.push(10);
    stack.push(20);
    stack.push(30);

    const poppedItem = stack.pop();

    expect(poppedItem).toBe(30);
    expect(stack.size).toBe(2);
  });

  it('peek should return undefined if the stack is empty', () => {
    expect(stack.peek()).toBeUndefined();
  });

  it('peek should return the top item from the stack without removing it', () => {
    stack.push(10);
    stack.push(20);
    stack.push(30);

    const peekedItem = stack.peek();

    expect(peekedItem).toBe(30);
    expect(stack.size).toBe(3);
  });

  it('clear should remove all items from the stack', () => {
    stack.push(10);
    stack.push(20);
    stack.push(30);

    stack.clear();

    expect(stack.size).toBe(0);
  });

  it('size should return the number of items in the stack', () => {
    stack.push(10);
    stack.push(20);
    stack.push(30);

    expect(stack.size).toBe(3);
  });

  it('isEmpty should return true if stack is empty', () => {
    expect(stack.isEmpty).toBe(true);
  });

  it('isEmpty should return false if stack is not empty', () => {
    stack.push(10);

    expect(stack.isEmpty).toBe(false);
  });
});
