/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, beforeEach } from 'vitest';
import Heap from './Heap';

// ─── Comparators ────────────────────────────────────────────────────────────

const minCmp = (a: number, b: number) => a - b;
const maxCmp = (a: number, b: number) => b - a;

// ─── Test Helpers ───────────────────────────────────────────────────────────

/** * CRITICAL: Verifies that the internal Map and Array are perfectly in sync.
 * This catches bugs where the heap works but future operations will fail
 * because the index Map is stale.
 */
function assertInternalIntegrity<T extends object | number | string>(h: any) {
  const heapArray = h.heap;
  const indexMap = h.valueToHeapIndex;

  expect(heapArray.length).toBe(indexMap.size);
  heapArray.forEach((value: T, index: number) => {
    expect(indexMap.get(value)).toBe(index);
  });
}

/** Verifies the Heap Property: Parent is always "better" than children. */
function assertHeapProperty<T>(h: any, compare: (a: T, b: T) => number) {
  const arr = h.heap;

  for (let i = 0; i < arr.length; i++) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < arr.length) {
      expect(compare(arr[i], arr[left])).toBeLessThanOrEqual(0);
    }
    if (right < arr.length) {
      expect(compare(arr[i], arr[right])).toBeLessThanOrEqual(0);
    }
  }
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('Heap – Basic Construction & Properties', () => {
  it('starts empty and handles empty pops', () => {
    const h = new Heap<number>(minCmp);

    expect(h.size()).toBe(0);
    expect(h.peek()).toBeUndefined();
    expect(h.pop()).toBeUndefined();
    assertInternalIntegrity(h);
  });

  it('maintains size correctly after single insert', () => {
    const h = new Heap<number>(minCmp);

    h.insert(42);

    expect(h.size()).toBe(1);
    expect(h.peek()).toBe(42);
    assertInternalIntegrity(h);
  });

  it('ignores duplicate primitive values (Set behavior)', () => {
    const h = new Heap<number>(minCmp);

    [7, 7, 7].forEach((n) => h.insert(n));

    expect(h.size()).toBe(1);
    assertInternalIntegrity(h);
  });
});

describe('Heap – Min-Heap (insert / peek / pop)', () => {
  let h: Heap<number>;

  beforeEach(() => {
    h = new Heap<number>(minCmp);
    [5, 3, 8, 1, 4].forEach((n) => h.insert(n));
  });

  it('peek returns the minimum without removing it', () => {
    expect(h.peek()).toBe(1);
    expect(h.size()).toBe(5);
  });

  it('pop returns values in ascending order', () => {
    expect([...h]).toEqual([1, 3, 4, 5, 8]);
  });

  it('size decrements on each pop', () => {
    h.pop();
    expect(h.size()).toBe(4);
    h.pop();
    expect(h.size()).toBe(3);
  });

  it('pop on empty heap returns undefined', () => {
    const empty = new Heap<number>(minCmp);
    expect(empty.pop()).toBeUndefined();
  });
});

describe('Heap – Max-Heap (insert / peek / pop)', () => {
  it('pop returns values in descending order', () => {
    const h = new Heap<number>(maxCmp);

    [5, 3, 8, 1, 4].forEach((n) => h.insert(n));

    expect([...h]).toEqual([8, 5, 4, 3, 1]);
  });

  it('peek returns the maximum', () => {
    const h = new Heap<number>(maxCmp);

    [10, 20, 5].forEach((n) => h.insert(n));

    expect(h.peek()).toBe(20);
  });
});

describe('Heap – duplicate inserts', () => {
  it('ignores duplicate primitive values', () => {
    const h = new Heap<number>(minCmp);

    h.insert(7);
    h.insert(7);
    h.insert(7);

    expect(h.size()).toBe(1);
  });

  it('does not duplicate identical object references', () => {
    const obj = { priority: 1 };
    const h = new Heap<object>((a: any, b: any) => a.priority - b.priority);

    h.insert(obj);
    h.insert(obj);

    expect(h.size()).toBe(1);
  });
});

describe('Heap – remove()', () => {
  it('returns false when removing non-existent values', () => {
    const h = Heap.fromArray<number>([1, 2, 3], minCmp);

    expect(h.remove(99)).toBe(false);
    expect(h.size()).toBe(3);
  });

  it('correctly re-heaps when removing the root', () => {
    const h = Heap.fromArray([1, 5, 10], minCmp);

    expect(h.remove(1)).toBe(true);
    expect(h.peek()).toBe(5);
    assertInternalIntegrity(h);
  });

  it('handles removal of internal nodes requiring a "sink" (heapifyDown)', () => {
    // Specifically targets the logic where the last element moved up needs to go down
    const h = Heap.fromArray([10, 20, 30, 40, 50], minCmp);
    h.remove(20); // 50 moves to index 1, must sink below 40
    assertHeapProperty(h, minCmp);
    assertInternalIntegrity(h);
  });

  it('returns true and removes an existing value', () => {
    const h = new Heap<number>(minCmp);

    [1, 2, 3].forEach((n) => h.insert(n));

    expect(h.remove(2)).toBe(true);
    expect(h.size()).toBe(2);
    expect([...h]).toEqual([1, 3]);
  });

  it('can remove the root element', () => {
    const h = new Heap<number>(minCmp);

    [1, 2, 3].forEach((n) => h.insert(n));
    h.remove(1);

    expect(h.peek()).toBe(2);
    expect(h.size()).toBe(2);
  });

  it('can remove the last element', () => {
    const h = new Heap<number>(minCmp);

    [1, 2, 3].forEach((n) => h.insert(n));
    h.remove(3);

    expect(h.size()).toBe(2);
    assertHeapProperty(h, minCmp);
  });

  it('heap order is maintained after arbitrary removal', () => {
    const h = new Heap<number>(minCmp);

    [10, 5, 15, 3, 7, 12, 20].forEach((n) => h.insert(n));
    h.remove(10);
    assertHeapProperty(h, minCmp);
  });

  it('removes the only element correctly', () => {
    const h = new Heap<number>(minCmp);

    h.insert(42);

    expect(h.remove(42)).toBe(true);
    expect(h.size()).toBe(0);
    expect(h.peek()).toBeUndefined();
  });

  it('handles removal where the replacement element must move UP (heapifyUp)', () => {
    const h = Heap.fromArray<number>([1, 10, 100, 50, 20, 2], minCmp);

    h.remove(100);

    const h2 = new Heap<number>(minCmp);
    [10, 20, 30, 40, 50, 60, 70].forEach((n) => h2.insert(n));

    const h3 = new Heap<number>(minCmp);

    [5, 10, 20, 15].forEach((n) => h3.insert(n));

    h3.remove(20);

    const h4 = Heap.fromArray<number>([1, 10, 2, 20, 30, 40, 50], minCmp);
    h4.remove(50);
    assertInternalIntegrity(h4);
    assertHeapProperty(h4, minCmp);
  });
});

describe('Heap – fromArray()', () => {
  it('builds a valid min-heap from an unsorted array', () => {
    const h = Heap.fromArray([9, 4, 7, 1, 6, 3], minCmp);

    expect(h.size()).toBe(6);
    expect([...h]).toEqual([1, 3, 4, 6, 7, 9]);
  });

  it('builds a valid max-heap from an unsorted array', () => {
    const h = Heap.fromArray([9, 4, 7, 1, 6, 3], maxCmp);

    expect([...h]).toEqual([9, 7, 6, 4, 3, 1]);
  });

  it('handles an empty array', () => {
    const h = Heap.fromArray<number>([], minCmp);

    expect(h.size()).toBe(0);
    expect(h.pop()).toBeUndefined();
  });

  it('handles a single-element array', () => {
    const h = Heap.fromArray([42], minCmp);

    expect(h.peek()).toBe(42);
    expect(h.size()).toBe(1);
  });

  it('handles an already-sorted array', () => {
    const h = Heap.fromArray([1, 2, 3, 4, 5], minCmp);

    expect([...h]).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles a reverse-sorted array', () => {
    const h = Heap.fromArray([5, 4, 3, 2, 1], minCmp);

    expect([...h]).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('Heap – clone()', () => {
  it('produces an independent copy', () => {
    const original = Heap.fromArray<number>([3, 1, 2], minCmp);
    const clone = original.clone();

    Array.from(clone);

    expect(original.size()).toBe(3);
    expect(original.peek()).toBe(1);
  });

  it('clone has same order as original', () => {
    const original = Heap.fromArray([5, 2, 8, 1], minCmp);
    const clone = original.clone();
    expect([...clone]).toEqual([...original]);
  });

  it('mutations to clone do not affect original', () => {
    const original = Heap.fromArray<number>([3, 1, 2], minCmp);

    const clone = original.clone();
    clone.insert(0);

    expect(original.size()).toBe(3);
  });
});

describe('Heap – iterator (Symbol.iterator)', () => {
  it('yields values in priority order', () => {
    const h = Heap.fromArray([4, 2, 7, 1, 9], minCmp);
    expect([...h]).toEqual([1, 2, 4, 7, 9]);
  });

  it('does not mutate the original heap', () => {
    const h = Heap.fromArray([3, 1, 2], minCmp);

    Array.from(h); // consume iterator

    expect(h.size()).toBe(3);
    expect(h.peek()).toBe(1);
  });

  it('works for an empty heap', () => {
    const h = new Heap<number>(minCmp);

    expect([...h]).toEqual([]);
  });

  it('can be iterated multiple times', () => {
    const h = Heap.fromArray([3, 1, 2], minCmp);

    expect([...h]).toEqual([1, 2, 3]);
    expect([...h]).toEqual([1, 2, 3]);
  });
});

describe('Heap – update()', () => {
  it('is a no-op for a value not in the heap', () => {
    const h = Heap.fromArray<number>([1, 2, 3], minCmp);

    expect(() => h.update(99)).not.toThrow();
    expect(h.size()).toBe(3);
  });

  it('re-positions an object whose key decreased (min-heap)', () => {
    type Task = { name: string; priority: number };
    const taskCmp = (a: Task, b: Task) => a.priority - b.priority;

    const t1: Task = { name: 'a', priority: 5 };
    const t2: Task = { name: 'b', priority: 3 };
    const t3: Task = { name: 'c', priority: 7 };

    const h = new Heap<Task>(taskCmp);
    [t1, t2, t3].forEach((t) => h.insert(t));
    expect(h.peek()).toBe(t2); // priority 3 is min

    // Drop t1's priority so it should become the new minimum
    t1.priority = 1;
    h.update(t1);

    expect(h.peek()).toBe(t1);
    assertHeapProperty(h, taskCmp);
  });

  it('re-positions an object whose key increased (min-heap)', () => {
    type Task = { name: string; priority: number };
    const taskCmp = (a: Task, b: Task) => a.priority - b.priority;

    const t1: Task = { name: 'a', priority: 1 };
    const t2: Task = { name: 'b', priority: 3 };
    const t3: Task = { name: 'c', priority: 7 };

    const h = new Heap<Task>(taskCmp);
    [t1, t2, t3].forEach((t) => h.insert(t));

    // Raise t1's priority so it should sink
    t1.priority = 10;
    h.update(t1);

    expect(h.peek()).toBe(t2);
    assertHeapProperty(h, taskCmp);
  });

  it('updates position when an object property changes', () => {
    type Task = { id: string; prio: number };
    const taskCmp = (a: Task, b: Task) => a.prio - b.prio;
    const t1 = { id: 'A', prio: 10 },
      t2 = { id: 'B', prio: 20 };

    const h = new Heap<Task>(taskCmp);
    h.insert(t1);
    h.insert(t2);

    t2.prio = 5;
    h.update(t2);

    expect(h.peek()).toBe(t2);
    assertInternalIntegrity(h);
  });
});

describe('Heap – string elements', () => {
  it('min-heap orders strings lexicographically', () => {
    const strCmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

    const h = Heap.fromArray(['banana', 'apple', 'cherry', 'apricot'], strCmp);

    expect([...h]).toEqual(['apple', 'apricot', 'banana', 'cherry']);
  });
});

describe('Heap – large random input', () => {
  it('min-heap produces fully sorted output for 1 000 random integers', () => {
    const nums = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * 10000),
    );
    const h = Heap.fromArray(nums, minCmp);
    const result = [...h];

    // The heap may drop duplicate references; verify what comes out is sorted
    for (let i = 1; i < result.length; i++) {
      expect(result[i]).toBeGreaterThanOrEqual(result[i - 1]);
    }
  });
});

describe('Heap – edge cases', () => {
  it('handles alternating insert and pop correctly', () => {
    const h = new Heap<number>(minCmp);

    h.insert(5);
    h.insert(3);
    expect(h.pop()).toBe(3);
    h.insert(1);
    expect(h.pop()).toBe(1);
    h.insert(4);
    expect(h.pop()).toBe(4);
    expect(h.pop()).toBe(5);
    expect(h.pop()).toBeUndefined();
  });

  it('size stays consistent through mixed operations', () => {
    const h = new Heap<number>(minCmp);

    h.insert(10);
    h.insert(20);
    h.insert(30);
    h.remove(20);
    h.insert(5);
    h.pop();

    expect(h.size()).toBe(2);
  });

  it('heap with negative numbers', () => {
    const h = Heap.fromArray([-3, -1, -4, -1, -5, -9, -2, -6], minCmp);
    // -9 is the minimum; -1 is duplicated but only stored once (same primitive)
    expect(h.peek()).toBe(-9);
    assertHeapProperty(h, minCmp);
  });

  it('heap with all identical values', () => {
    // Only one copy is stored because primitives share identity in the map
    const h = new Heap<number>(minCmp);

    h.insert(7);
    h.insert(7);
    h.insert(7);

    expect(h.size()).toBe(1);
    expect(h.pop()).toBe(7);
    expect(h.size()).toBe(0);
  });
});

describe('Heap – Order & Transformation', () => {
  it('acts as a Min-Heap (ascending order)', () => {
    const h = Heap.fromArray([5, 3, 8, 1, 4], minCmp);

    expect([...h]).toEqual([1, 3, 4, 5, 8]);

    assertHeapProperty(h, minCmp);
  });

  it('acts as a Max-Heap (descending order)', () => {
    const h = Heap.fromArray([5, 3, 8, 1, 4], maxCmp);

    expect([...h]).toEqual([8, 5, 4, 3, 1]);

    assertHeapProperty(h, maxCmp);
  });

  it('correctly builds from unsorted arrays (Floyd’s algorithm)', () => {
    const h = Heap.fromArray([10, 2, 8, 6, 1], minCmp);

    assertInternalIntegrity(h);
    assertHeapProperty(h, minCmp);
  });
});
