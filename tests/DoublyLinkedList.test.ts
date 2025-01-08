import { beforeEach, describe, expect, it } from 'vitest';
import DoublyLinkedList from '../src/data-structures/doubly-linked-list/DoublyLinkedList';

describe('DoublyLinkedList', () => {
  let list: DoublyLinkedList<number>;

  beforeEach(() => {
    list = new DoublyLinkedList();
  });

  it('list should initially be empty', () => {
    expect(list.isEmpty).toBe(true);
    expect(list.size).toBe(0);
  });
});
