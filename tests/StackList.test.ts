import { beforeEach, describe, expect, it } from 'vitest';
import StackList from '../src/data-structures/stack/StackList';

describe('StackList', () => {
  let stack: StackList<number>;

  beforeEach(() => {
    stack = new StackList();
  });

  it('should initially be empty', () => {
    expect(stack.isEmpty).toBe(true);
    expect(stack.size).toBe(0);
  });
});
