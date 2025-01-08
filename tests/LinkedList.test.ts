import { beforeEach, describe, expect, it } from 'vitest';
import SinglyLinkedList from '../src/data-structures/singly-linked-list/SinglyLinkedList';

describe('Singly Linked List', () => {
  let list: SinglyLinkedList<number>;

  beforeEach(() => {
    list = new SinglyLinkedList();
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
    expect(list.pop()).toBeNull();
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
    expect(list.shift()).toBeNull();
  });

  it('shift should remove and return the first node in the list', () => {
    list.push(10);
    list.push(20);

    const removedNode = list.shift();

    expect(removedNode?.value).toBe(10);
    expect(list.size).toBe(1);
    expect(list.getHead()?.value).toBe(20);
  });

  it('removeNodeAt should return null if invalid index', () => {
    list.push(10);

    expect(list.removeNodeAt(5)).toBeNull();
  });

  it('removeNodeAt should remove and return the node at a specific index', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    const removedNode = list.removeNodeAt(1);

    expect(removedNode?.value).toBe(20);
    expect(list.size).toBe(2);
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

  it('getHead should return the first node in the list', () => {
    list.push(10);
    list.push(20);

    expect(list.getHead()?.value).toBe(10);
    expect(list.size).toBe(2);
  });

  it('getTail should return the last node in the list', () => {
    list.push(10);
    list.push(20);

    expect(list.getTail()?.value).toBe(20);
    expect(list.size).toBe(2);
  });

  it('setNodeAt should not update the value of a node at an invalid index', () => {
    list.push(5);
    list.push(20);
    list.push(30);

    const updatedValue = list.setNodeAt(5, 40);

    expect(updatedValue).toBe(false);
  });

  it('setNodeAt should update the value of a node at a specific index', () => {
    list.push(5);
    list.push(20);
    list.push(30);

    const updatedValue = list.setNodeAt(0, 10);

    expect(updatedValue).toBe(true);
    expect(list.getHead()?.value).toBe(10);
    expect(list.size).toBe(3);
  });

  it('getNodeAt should return null if invalid index', () => {
    list.push(10);

    expect(list.getNodeAt(5)).toBeNull();
  });

  it('getNodeAt should return the node at a specific index', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    expect(list.getNodeAt(1)?.value).toBe(20);
  });

  it('deleteHead should remove the first node from the list', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    list.deleteHead();

    expect(list.getHead()?.value).toBe(20);
    expect(list.size).toBe(2);
  });

  it('deleteTail should remove the lase node from the list', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    list.deleteTail();

    expect(list.getTail()?.value).toBe(20);
    expect(list.size).toBe(2);
  });

  it('deleteAt should not delete a node at an invalid index', () => {
    list.push(10);

    const deleted = list.deleteAt(5);

    expect(deleted).toBe(false);
  });

  it('deleteAt should remove a node at a specific index', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    const deleted = list.deleteAt(1);

    expect(deleted).toBe(true);
    expect(list.getHead()?.value).toBe(10);
    expect(list.getTail()?.value).toBe(30);
    expect(list.size).toBe(2);
  });

  it('reverse should reverse the list', () => {
    list.push(10);
    list.push(20);
    list.push(30);
    list.reverse();

    expect(list.getHead()?.value).toBe(30);
    expect(list.getTail()?.value).toBe(10);
  });

  it('clear should clear the list', () => {
    list.push(10);
    list.push(20);
    list.clear();

    expect(list.isEmpty).toBe(true);
    expect(list.size).toBe(0);
    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();
  });

  it('contains should check if the list contains an element', () => {
    list.push(10);
    list.push(20);

    expect(list.contains(10)).toBe(true);
    expect(list.contains(30)).toBe(false);
  });

  it('indexOf should find the index of an element', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    expect(list.indexOf(20)).toBe(1);
    expect(list.indexOf(40)).toBe(-1);
  });

  it('isEmpty should return true if list is empty', () => {
    expect(list.isEmpty).toBe(true);
  });

  it('isEmpty should return false if list is not empty', () => {
    list.push(10);

    expect(list.isEmpty).toBe(false);
  });
});
