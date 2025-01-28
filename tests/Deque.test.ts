import { beforeEach, describe, expect, it } from 'vitest';
import Deque from '../src/data-structures/deque/Deque';

describe('Deque', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque();
  });

  it('deque should initially be empty', () => {
    expect(deque.isEmpty()).toBe(true);
    expect(deque.size()).toBe(0);
  });
});
