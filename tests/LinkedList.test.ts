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

  it('push should add a node to the end of the list', () => {
    list.unshift(10);
    list.push(20);

    expect(list.size).toBe(2);
    expect(list.getTail()?.value).toBe(20);
    expect(list.getHead()?.value).toBe(10);
  });

  it('pop should remove and return the last node in the list', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    const poppedNode = list.pop();

    expect(poppedNode?.value).toBe(30);
    expect(list.size).toBe(2);
    expect(list.getTail()?.value).toBe(20);
  });
});
