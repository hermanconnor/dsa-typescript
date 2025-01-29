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

  it('addFirst should add an item to the front of the deque', () => {
    deque.addFirst(10);
    deque.addFirst(20);

    expect(deque.peekFirst()).toBe(20);
    expect(deque.size()).toBe(2);
  });

  it('peekFirst should return null if there are no items in the deque', () => {
    expect(deque.peekFirst()).toBeNull();
  });

  it('peekFirst should return the first element in the deque without removing it', () => {
    deque.addFirst(10);
    deque.addFirst(20);

    expect(deque.peekFirst()).toBe(20);
    expect(deque.size()).toBe(2);
  });

  it('size should correctly return the size of the deque', () => {
    deque.addFirst(10);
    deque.addFirst(20);

    expect(deque.size()).toBe(2);
  });

  it('isEmpty should return true if the deque is empty', () => {
    expect(deque.isEmpty()).toBe(true);
  });

  it('isEmpty should return false if the deque is not empty', () => {
    deque.addFirst(10);

    expect(deque.isEmpty()).toBe(false);
  });
});
