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

  it('pop should return null if the list is empty', () => {
    expect(list.pop()).toBe(null);
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

  it('unshift should add a node to the beginning of the list', () => {
    list.push(20);
    list.push(30);
    list.unshift(10);

    expect(list.size).toBe(3);
    expect(list.getHead()?.value).toBe(10);
    expect(list.getTail()?.value).toBe(30);
  });

  it('shift should return null if the list is empty', () => {
    expect(list.shift()).toBe(null);
  });

  it('shift should remove and return the first node in the list', () => {
    list.push(10);
    list.push(20);

    const removedNode = list.shift();

    expect(removedNode?.value).toBe(10);
    expect(list.size).toBe(1);
    expect(list.getHead()?.value).toBe(20);
  });

  it('insertNodeAt should not insert a node at an invalid index', () => {
    const inserted = list.insertNodeAt(1, 100);

    expect(inserted).toBe(false);
  });

  it('insertNodeAt should insert a node at a specific index', () => {
    list.push(10);
    list.push(30);

    const inserted = list.insertNodeAt(1, 20);

    expect(inserted).toBe(true);
    expect(list.size).toBe(3);
    expect(list.getNodeAt(1)?.value).toBe(20);
  });
});
