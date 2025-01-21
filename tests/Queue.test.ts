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
});
