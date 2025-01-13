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

  it('push should add a node to the end of the list', () => {
    list.push(10);
    list.push(20);

    expect(list.size).toBe(2);
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
    expect(list.size).toBe(1);
    expect(list.getTail()?.value).toBe(10);
  });

  it('unshift should add a node to the beginning of the list', () => {
    list.push(20);
    list.unshift(10);

    expect(list.size).toBe(2);
    expect(list.getHead()?.value).toBe(10);
    expect(list.getTail()?.value).toBe(20);
  });

  it('getHead should return the first node in the list', () => {
    list.push(10);
    list.push(20);

    expect(list.size).toBe(2);
    expect(list.getHead()?.value).toBe(10);
  });

  it('getTail should return the last node in the list', () => {
    list.push(10);
    list.push(20);

    expect(list.size).toBe(2);
    expect(list.getTail()?.value).toBe(20);
  });

  it('clear should remove all items from the list', () => {
    list.push(10);
    list.push(20);
    list.clear();

    expect(list.isEmpty).toBe(true);
    expect(list.size).toBe(0);
    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();
  });

  it('size should return the length of the list', () => {
    list.push(10);
    list.push(20);

    expect(list.size).toBe(2);
  });

  it('isEmpty should return true if list is empty', () => {
    expect(list.isEmpty).toBe(true);
  });

  it('isEmpty should return false if list is not empty', () => {
    list.push(10);

    expect(list.size).toBe(1);
    expect(list.isEmpty).toBe(false);
  });
});
