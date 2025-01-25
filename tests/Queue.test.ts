import { beforeEach, describe, expect, it } from 'vitest';

import Queue from '../src/data-structures/queue/Queue';

describe('Queue', () => {
  let queue: Queue<number>;

  beforeEach(() => {
    queue = new Queue();
  });

  it('queue should initially be empty', () => {
    expect(queue.isEmpty()).toBe(true);
    expect(queue.size()).toBe(0);
  });

  it('enqueue should add an item to the end of an empty queue correctly', () => {
    queue.enqueue(10);

    expect(queue.getHead()?.value).toBe(10);
    expect(queue.getTail()?.value).toBe(10);
    expect(queue.size()).toBe(1);
  });

  it('enqueue should add an item to the end of a non-empty queue correctly', () => {
    queue.enqueue(10);
    queue.enqueue(20);

    expect(queue.getTail()?.value).toBe(20);
    expect(queue.getHead()?.value).toBe(10);
    expect(queue.size()).toBe(2);
  });

  it('enqueue should maintain FIFO order when multiple items are enqueued', () => {
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    expect(queue.getHead()?.value).toBe(10);
    expect(queue.getTail()?.value).toBe(30);
    expect(queue.size()).toBe(3);
  });

  it('enqueue should increment the length after enqueueing', () => {
    expect(queue.size()).toBe(0);
    queue.enqueue(10);
    expect(queue.size()).toBe(1);
    queue.enqueue(20);
    expect(queue.size()).toBe(2);
  });

  it('enqueue should update the previous tail node to point to the new node', () => {
    queue.enqueue(10);
    const prevTail = queue.getTail();
    queue.enqueue(20);

    expect(prevTail?.next?.value).toBe(20);
  });

  it('dequeue should return null when trying to dequeue from an empty queue', () => {
    const result = queue.dequeue();

    expect(result).toBeNull();
  });

  it('dequeue should remove and return the first item in the queue', () => {
    queue.enqueue(10);
    queue.enqueue(20);

    const result = queue.dequeue();

    expect(result).toBe(10);
    expect(queue.size()).toBe(1);
    expect(queue.peek()).toBe(20);
  });

  it('dequeue should set tail to null when the queue becomes empty after dequeue', () => {
    queue.enqueue(10);

    queue.dequeue();

    expect(queue.getTail()).toBeNull();
  });

  it('dequeue should correctly update the head after a dequeue', () => {
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    queue.dequeue();

    expect(queue.peek()).toBe(20);
  });

  it('peek should return null when the queue is empty', () => {
    const result = queue.peek();

    expect(result).toBeNull();
  });

  it('peek should return the first item without removing it', () => {
    queue.enqueue(10);
    queue.enqueue(20);

    const result = queue.peek();

    expect(result).toBe(10);
    expect(queue.size()).toBe(2);
  });

  it('getHead & getTail should return null for both head and tail when the queue is empty', () => {
    expect(queue.getHead()).toBeNull();
    expect(queue.getTail()).toBeNull();
  });

  it('getHead & getTail should return the correct head and tail when the queue has one item', () => {
    queue.enqueue(10);

    expect(queue.getHead()?.value).toBe(10);
    expect(queue.getTail()?.value).toBe(10);
  });

  it('should return the correct head and tail when the queue has multiple elements', () => {
    queue.enqueue(10);
    queue.enqueue(20);

    expect(queue.getHead()?.value).toBe(10);
    expect(queue.getTail()?.value).toBe(20);
  });

  it('size should return 0 when the queue is empty', () => {
    expect(queue.size()).toBe(0);
  });

  it('size should return the correct size after enqueueing elements', () => {
    queue.enqueue(10);
    queue.enqueue(20);

    expect(queue.size()).toBe(2);
  });

  it('isEmpty should return true when the queue is empty', () => {
    expect(queue.isEmpty()).toBe(true);
  });

  it('isEmpty should return false when the queue has elements', () => {
    queue.enqueue(10);

    expect(queue.isEmpty()).toBe(false);
  });

  it('clear should do nothing if the queue is already empty', () => {
    queue.clear();

    expect(queue.size()).toBe(0);
    expect(queue.getHead()).toBeNull();
    expect(queue.getTail()).toBeNull();
  });

  it('clear should clear all elements from the queue', () => {
    queue.enqueue(10);
    queue.enqueue(20);

    queue.clear();

    expect(queue.size()).toBe(0);
    expect(queue.getHead()).toBeNull();
    expect(queue.getTail()).toBeNull();
  });
});
