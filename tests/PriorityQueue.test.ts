import { beforeEach, describe, expect, it } from 'vitest';
import PriorityQueue from '../src/data-structures/priority-queue/PriorityQueue';

describe('PriorityQueue', () => {
  let pq: PriorityQueue<number>;

  beforeEach(() => {
    pq = new PriorityQueue();
  });

  it('Priority Queue should be initialized empty', () => {
    expect(pq.isEmpty()).toBe(true);
    expect(pq.size()).toBe(0);
  });

  it('should return undefined when dequeue from empty queue', () => {
    expect(pq.dequeue()).toBeUndefined();
  });

  it('should return undefined when peeking from empty queue', () => {
    expect(pq.peek()).toBeUndefined();
  });

  it('should handle a single element', () => {
    pq.enqueue(5);

    expect(pq.size()).toBe(1);
    expect(pq.peek()).toBe(5);
    expect(pq.dequeue()).toBe(5);
    expect(pq.isEmpty()).toBe(true);
  });

  it('should enqueue elements and update size', () => {
    pq.enqueue(5);
    pq.enqueue(3);
    pq.enqueue(8);

    expect(pq.size()).toBe(3);
    expect(pq.peek()).toBe(3);
  });

  it('should dequeue elements in correct order (min-heap)', () => {
    pq.enqueue(5);
    pq.enqueue(3);
    pq.enqueue(8);

    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(5);
    expect(pq.dequeue()).toBe(8);
    expect(pq.isEmpty()).toBe(true);
  });

  it('should enqueue and dequeue elements in correct order (default ascending)', () => {
    pq.enqueue(3);
    pq.enqueue(1);
    pq.enqueue(4);
    pq.enqueue(2);

    expect(pq.dequeue()).toBe(1);
    expect(pq.dequeue()).toBe(2);
    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(4);
  });

  it('should peek the highest priority element without modifying the queue', () => {
    pq.enqueue(3);
    pq.enqueue(1);
    pq.enqueue(4);

    expect(pq.peek()).toBe(1);
    expect(pq.size()).toBe(3);
  });

  it('should maintain heap property on enqueue and dequeue', () => {
    pq.enqueue(10);
    pq.enqueue(5);
    pq.enqueue(15);

    expect(pq.dequeue()).toBe(5);
    expect(pq.peek()).toBe(10);
  });

  it('should handle custom comparison function (max-heap)', () => {
    const maxHeap = new PriorityQueue<number>((a, b) => b - a); // Max Heap

    maxHeap.enqueue(5);
    maxHeap.enqueue(3);
    maxHeap.enqueue(8);

    expect(maxHeap.dequeue()).toBe(8); // 8 is the largest, so it should be dequeued first
  });

  it('should handle custom comparison function (object priority)', () => {
    const queue = new PriorityQueue<{ value: string; priority: number }>(
      (a, b) => a.priority - b.priority,
    );

    queue.enqueue({ value: 'Low', priority: 3 });
    queue.enqueue({ value: 'High', priority: 1 });
    queue.enqueue({ value: 'Medium', priority: 2 });

    expect(queue.dequeue()?.value).toBe('High');
    expect(queue.dequeue()?.value).toBe('Medium');
    expect(queue.dequeue()?.value).toBe('Low');
  });

  it('should handle duplicate elements', () => {
    pq.enqueue(5);
    pq.enqueue(5);
    pq.enqueue(3);

    expect(pq.dequeue()).toBe(3); // Smallest first
    expect(pq.dequeue()).toBe(5);
    expect(pq.dequeue()).toBe(5);
  });
});
