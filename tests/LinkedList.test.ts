import { beforeEach, describe, expect, it } from 'vitest';
import SinglyLinkedList from '../src/data-structures/singly-linked-list/SinglyLinkedList';

describe('Singly Linked List', () => {
  let list: SinglyLinkedList<number>;

  beforeEach(() => {
    list = new SinglyLinkedList<number>();
  });

  it('should initially be empty', () => {
    expect(list.isEmpty).toBe(true);
    expect(list.size).toBe(0);
  });
});
