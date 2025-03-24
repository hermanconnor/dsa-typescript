import { beforeEach, describe, expect, it } from 'vitest';
import PriorityQueue from '../src/data-structures/priority-queue/PriorityQueue';

describe('PriorityQueue', () => {
  let pq: PriorityQueue<number>;
  let stringPq: PriorityQueue<string>;
  let objectPq: PriorityQueue<{ value: string; priority: number }>;

  beforeEach(() => {
    pq = new PriorityQueue();
    stringPq = new PriorityQueue();
    objectPq = new PriorityQueue((a, b) => a.priority - b.priority);
  });
});
