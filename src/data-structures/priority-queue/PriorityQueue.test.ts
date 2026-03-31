import { describe, it, expect, beforeEach } from 'vitest';
import PriorityQueue from './PriorityQueue';

// ── Max Heap (default) ────────────────────────────────────────────────────────

describe('PriorityQueue – max heap (default)', () => {
  let pq: PriorityQueue<string>;

  beforeEach(() => {
    pq = new PriorityQueue<string>();
  });

  it('starts empty', () => {
    expect(pq.size).toBe(0);
    expect(pq.empty).toBe(true);
  });

  it('peek() returns undefined on empty queue', () => {
    expect(pq.peek()).toBeUndefined();
  });

  it('pop() returns undefined on empty queue', () => {
    expect(pq.pop()).toBeUndefined();
  });

  it('peek() returns the highest-priority item without removing it', () => {
    pq.push('low', 1);
    pq.push('high', 10);
    pq.push('mid', 5);

    expect(pq.peek()).toBe('high');
    expect(pq.size).toBe(3);
  });

  it('pop() removes and returns items in descending priority order', () => {
    pq.push('a', 3);
    pq.push('b', 1);
    pq.push('c', 2);

    expect(pq.pop()).toBe('a');
    expect(pq.pop()).toBe('c');
    expect(pq.pop()).toBe('b');
    expect(pq.pop()).toBeUndefined();
  });

  it('size decrements on each pop', () => {
    pq.push('x', 1);
    pq.push('y', 2);
    expect(pq.size).toBe(2);
    pq.pop();
    expect(pq.size).toBe(1);
    pq.pop();
    expect(pq.size).toBe(0);
    expect(pq.empty).toBe(true);
  });

  it('handles a single element correctly', () => {
    pq.push('only', 42);
    expect(pq.peek()).toBe('only');
    expect(pq.pop()).toBe('only');
    expect(pq.empty).toBe(true);
  });
});

// ── Min Heap ──────────────────────────────────────────────────────────────────

describe('PriorityQueue – min heap', () => {
  it('pop() returns items in ascending priority order', () => {
    const pq = new PriorityQueue<string>('min');

    pq.push('high', 100);
    pq.push('low', 1);
    pq.push('mid', 50);

    expect(pq.pop()).toBe('low');
    expect(pq.pop()).toBe('mid');
    expect(pq.pop()).toBe('high');
  });

  it('peek() returns the lowest-priority item', () => {
    const pq = new PriorityQueue<string>('min');

    pq.push('a', 10);
    pq.push('b', 2);

    expect(pq.peek()).toBe('b');
  });
});

// ── FIFO Stability ────────────────────────────────────────────────────────────

describe('FIFO stability on equal priorities', () => {
  it('max heap: earlier insertion wins on tie', () => {
    const pq = new PriorityQueue<string>('max');

    pq.push('first', 5);
    pq.push('second', 5);
    pq.push('third', 5);

    expect(pq.pop()).toBe('first');
    expect(pq.pop()).toBe('second');
    expect(pq.pop()).toBe('third');
  });

  it('min heap: earlier insertion wins on tie', () => {
    const pq = new PriorityQueue<string>('min');

    pq.push('first', 1);
    pq.push('second', 1);

    expect(pq.pop()).toBe('first');
    expect(pq.pop()).toBe('second');
  });
});

// ── Update (push duplicate key) ───────────────────────────────────────────────

describe('push() on duplicate key updates priority', () => {
  it('promotes an item when its priority increases (max heap)', () => {
    const pq = new PriorityQueue<string>('max');

    pq.push('a', 1);
    pq.push('b', 5);
    pq.push('a', 10); // update 'a' from 1 → 10

    expect(pq.size).toBe(2); // no new entry added
    expect(pq.pop()).toBe('a');
    expect(pq.pop()).toBe('b');
  });

  it('demotes an item when its priority decreases (max heap)', () => {
    const pq = new PriorityQueue<string>('max');

    pq.push('a', 10);
    pq.push('b', 5);
    pq.push('a', 1); // demote 'a' from 10 → 1

    expect(pq.pop()).toBe('b');
    expect(pq.pop()).toBe('a');
  });

  it('promotes an item when its priority decreases (min heap)', () => {
    const pq = new PriorityQueue<string>('min');

    pq.push('a', 10);
    pq.push('b', 5);
    pq.push('a', 1); // update 'a' from 10 → 1

    expect(pq.size).toBe(2);
    expect(pq.pop()).toBe('a');
    expect(pq.pop()).toBe('b');
  });

  it('size does not grow on duplicate push', () => {
    const pq = new PriorityQueue<string>();

    pq.push('x', 1);
    pq.push('x', 99);

    expect(pq.size).toBe(1);
  });
});

// ── Custom Key Selector ───────────────────────────────────────────────────────

describe('custom keySelector', () => {
  interface Task {
    id: number;
    name: string;
  }

  it('deduplicates by custom key', () => {
    const pq = new PriorityQueue<Task, number>('max', (t) => t.id);

    pq.push({ id: 1, name: 'original' }, 5);
    pq.push({ id: 1, name: 'updated' }, 10);

    expect(pq.size).toBe(1);
    expect(pq.pop()?.name).toBe('updated');
  });

  it('treats different ids as separate entries', () => {
    const pq = new PriorityQueue<Task, number>('max', (t) => t.id);

    pq.push({ id: 1, name: 'A' }, 3);
    pq.push({ id: 2, name: 'B' }, 7);

    expect(pq.size).toBe(2);
    expect(pq.pop()?.id).toBe(2);
  });
});

// ── PriorityQueue.from() ──────────────────────────────────────────────────────

describe('PriorityQueue.from()', () => {
  it('builds a max heap from an array and pops in correct order', () => {
    const pq = PriorityQueue.from(['a', 'b', 'c', 'd'], (s) => s.charCodeAt(0));

    expect(pq.size).toBe(4);
    expect(pq.pop()).toBe('d');
    expect(pq.pop()).toBe('c');
    expect(pq.pop()).toBe('b');
    expect(pq.pop()).toBe('a');
  });

  it('builds a min heap from an array', () => {
    const pq = PriorityQueue.from([30, 10, 20], (n) => n, 'min');

    expect(pq.pop()).toBe(10);
    expect(pq.pop()).toBe(20);
    expect(pq.pop()).toBe(30);
  });

  it('handles an empty array', () => {
    const pq = PriorityQueue.from<string>([], (s) => s.length);

    expect(pq.empty).toBe(true);
    expect(pq.pop()).toBeUndefined();
  });

  it('handles a single-element array', () => {
    const pq = PriorityQueue.from(['only'], (s) => s.length);

    expect(pq.size).toBe(1);
    expect(pq.pop()).toBe('only');
  });

  it('produces the same order as push()-based construction', () => {
    const items = [5, 3, 8, 1, 9, 2, 7];

    const fromPq = PriorityQueue.from(items, (n) => n);
    const pushPq = new PriorityQueue<number>();
    items.forEach((n) => pushPq.push(n, n));

    const fromOrder: number[] = [];
    const pushOrder: number[] = [];
    while (!fromPq.empty) fromOrder.push(fromPq.pop()!);
    while (!pushPq.empty) pushOrder.push(pushPq.pop()!);

    expect(fromOrder).toEqual(pushOrder);
  });

  it('accepts a custom keySelector', () => {
    interface Task {
      id: number;
    }

    const pq = PriorityQueue.from<Task, number>(
      [{ id: 3 }, { id: 1 }, { id: 2 }],
      (t) => t.id,
      'min',
      (t) => t.id,
    );

    expect(pq.pop()?.id).toBe(1);
    expect(pq.pop()?.id).toBe(2);
    expect(pq.pop()?.id).toBe(3);
  });
});

// ── Large / Stress ────────────────────────────────────────────────────────────

describe('stress test', () => {
  it('correctly sorts 1000 random priorities', () => {
    const pq = new PriorityQueue<number>('max');
    const values = Array.from({ length: 1000 }, () => Math.random() * 10000);
    values.forEach((v) => pq.push(v, v));

    const result: number[] = [];
    while (!pq.empty) result.push(pq.pop()!);

    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeLessThanOrEqual(result[i - 1]);
    }
  });
});
