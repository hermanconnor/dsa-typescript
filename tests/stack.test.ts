import { beforeEach, describe, expect, it } from 'vitest';
import Stack from '../src/stack/Stack';

describe('Stack', () => {
  let stack: Stack<number>;

  beforeEach(() => {
    stack = new Stack();
  });

  it('should initially be empty', () => {
    expect(stack.isEmpty()).toBe(true);
    expect(stack.size()).toBe(0);
  });
});
