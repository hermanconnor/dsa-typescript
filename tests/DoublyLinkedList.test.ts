import { beforeEach, describe, expect, it } from 'vitest';
import DoublyLinkedList from '../src/data-structures/doubly-linked-list/DoublyLinkedList';

describe('DoublyLinkedList', () => {
  let list: DoublyLinkedList<number>;

  beforeEach(() => {
    list = new DoublyLinkedList();
  });

  it('list should initially be empty', () => {
    expect(list.isEmpty()).toBe(true);
    expect(list.size()).toBe(0);
  });

  it('push should add a node to the end of the list', () => {
    list.push(10);
    list.push(20);

    expect(list.size()).toBe(2);
    expect(list.getHead()?.value).toBe(10);
    expect(list.getTail()?.value).toBe(20);
  });

  it('pop should return null if the list is empty', () => {
    expect(list.pop()).toBeNull();
  });

  it('pop should remove the last node in the list and return the value', () => {
    list.push(10);
    list.push(20);

    const poppedValue = list.pop();

    expect(poppedValue).toBe(20);
    expect(list.size()).toBe(1);
    expect(list.getTail()?.value).toBe(10);
  });

  it('unshift should add a node to the beginning of the list', () => {
    list.push(20);
    list.unshift(10);

    expect(list.size()).toBe(2);
    expect(list.getHead()?.value).toBe(10);
    expect(list.getTail()?.value).toBe(20);
  });

  it('shift should return null if the list is empty', () => {
    expect(list.shift()).toBeNull();
  });

  it('shift should remove the first node in the list and return the value', () => {
    list.push(10);
    list.push(20);

    const removedNode = list.shift();

    expect(removedNode).toBe(10);
    expect(list.size()).toBe(1);
    expect(list.getHead()?.value).toBe(20);
  });

  it('insertNodeAt should not insert a node at an invalid index', () => {
    const inserted = list.insertNodeAt(1, 10);

    expect(inserted).toBe(false);
  });

  it('insertNodeAt should insert a node at a specific index', () => {
    list.push(10);
    list.push(30);

    const inserted = list.insertNodeAt(1, 20);

    expect(inserted).toBe(true);
    expect(list.size()).toBe(3);
    expect(list.getNodeAt(1)?.value).toBe(20);
  });

  it('removeNodeAt should return null if the index is invalid', () => {
    list.push(10);

    expect(list.removeNodeAt(5)).toBeNull();
  });

  it("removeNodeAt should remove the node at the given index and return it's value", () => {
    list.push(10);
    list.push(20);
    list.push(30);

    const removedNode = list.removeNodeAt(1);

    expect(removedNode).toBe(20);
    expect(list.size()).toBe(2);
  });

  it('setNodeValueAt should not update the value of a node at an invalid index', () => {
    list.push(10);
    list.push(20);

    const updatedValue = list.setNodeValueAt(100, 30);

    expect(updatedValue).toBe(false);
  });

  it('setNodeValueAt should update the value of a node at the given index', () => {
    list.push(5);
    list.push(20);

    const updatedValue = list.setNodeValueAt(0, 10);

    expect(updatedValue).toBe(true);
    expect(list.getHead()?.value).toBe(10);
    expect(list.size()).toBe(2);
  });

  it('getNodeAt should return null if the index is invalid', () => {
    list.push(10);

    expect(list.getNodeAt(5)).toBeNull();
  });

  it('getNodeAt should return the node at the specific index', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    expect(list.getNodeAt(0)?.value).toBe(10);
    expect(list.getNodeAt(2)?.value).toBe(30);
    expect(list.getNodeAt(1)?.value).toBe(20);
  });

  it('getHead should return the first node in the list', () => {
    list.push(10);
    list.push(20);

    expect(list.size()).toBe(2);
    expect(list.getHead()?.value).toBe(10);
  });

  it('getTail should return the last node in the list', () => {
    list.push(10);
    list.push(20);

    expect(list.size()).toBe(2);
    expect(list.getTail()?.value).toBe(20);
  });

  it('reverse should do nothing when the list is empty', () => {
    list.reverse();

    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();
  });

  it('reverse should do nothing when the list has only one node', () => {
    list.push(10);
    list.reverse();

    expect(list.getHead()?.value).toBe(10);
    expect(list.getTail()?.value).toBe(10);
    expect(list.getHead()?.value).toBe(list.getTail()?.value);
  });

  it('reverse should reverse a list with only two nodes', () => {
    list.push(10);
    list.push(20);

    list.reverse();

    expect(list.getHead()?.value).toBe(20);
    expect(list.getTail()?.value).toBe(10);
    expect(list.getHead()?.next?.value).toBe(10);
    expect(list.getTail()?.prev?.value).toBe(20);
  });

  it('reverse should reverse a multi-node list', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    list.reverse();

    expect(list.getHead()?.value).toBe(30);
    expect(list.getTail()?.value).toBe(10);
    expect(list.getHead()?.next?.value).toBe(20);
    expect(list.getHead()?.next?.next?.value).toBe(10);
    expect(list.getTail()?.prev?.value).toBe(20);
    expect(list.getTail()?.prev?.prev?.value).toBe(30);
  });

  it('reverse should return the list to original order after two reversals', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    list.reverse();
    list.reverse();

    expect(list.getHead()?.value).toBe(10);
    expect(list.getTail()?.value).toBe(30);
    expect(list.getHead()?.next?.value).toBe(20);
    expect(list.getTail()?.prev?.value).toBe(20);
  });

  it("reverse should set the new tail's next to null", () => {
    list.push(10);
    list.push(20);
    list.push(30);

    list.reverse();

    expect(list.getTail()?.next).toBeNull();
  });

  it('indexOf should return -1 when the list is empty', () => {
    expect(list.indexOf(5)).toBe(-1);
  });

  it('indexOf should return 0 when there is one element in the list', () => {
    list.push(10);

    expect(list.indexOf(10)).toBe(0);
  });

  it('indexOf should return the correct index of the value', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    expect(list.indexOf(20)).toBe(1);
  });

  it('indexOf should return -1 when value is not in the list', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    expect(list.indexOf(40)).toBe(-1);
  });

  it('indexOf should return 0 when value is at the beginning of the list', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    expect(list.indexOf(10)).toBe(0);
  });

  it('indexOf should return the correct index when value at the end of the list', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    expect(list.indexOf(30)).toBe(2);
  });

  it('indexOf should return the index of the first occurrence of a value', () => {
    list.push(10);
    list.push(20);
    list.push(20);
    list.push(30);

    expect(list.indexOf(20)).toBe(1);
  });

  it('contains should return false when the list is empty', () => {
    expect(list.contains(10)).toBe(false);
  });

  it('contains should return true if the value exists in a single-element list', () => {
    list.push(10);

    expect(list.contains(10)).toBe(true);
  });

  it('contains should return false if the value does not exist in a single-element list', () => {
    list.push(10);

    expect(list.contains(20)).toBe(false);
  });

  it('contains should return true if the value exists in a multi-element list', () => {
    list.push(10);
    list.push(20);
    list.push(30);

    expect(list.contains(20)).toBe(true);
  });

  it('clear should remove all items from the list', () => {
    list.push(10);
    list.push(20);
    list.clear();

    expect(list.isEmpty()).toBe(true);
    expect(list.size()).toBe(0);
    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();
  });

  it('size should return the length of the list', () => {
    list.push(10);
    list.push(20);

    expect(list.size()).toBe(2);
  });

  it('isEmpty should return true if list is empty', () => {
    expect(list.isEmpty()).toBe(true);
  });

  it('isEmpty should return false if list is not empty', () => {
    list.push(10);

    expect(list.size()).toBe(1);
    expect(list.isEmpty()).toBe(false);
  });
});
