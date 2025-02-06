import { beforeEach, describe, expect, it, vi } from 'vitest';
import MinHeap from '../src/data-structures/heap/MinHeap';

describe('MinHeap', () => {
  let heap: MinHeap<number>;

  beforeEach(() => {
    heap = new MinHeap();
  });
});
