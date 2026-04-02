import { describe, it, expect } from 'vitest';
import CircularDeque from './CircularDeque';

// ---------------------------------------------------------------------------
// Constructor & Initialization
// ---------------------------------------------------------------------------
describe('Constructor', () => {
  it('creates an empty deque with no arguments', () => {
    const dq = new CircularDeque<number>();
    expect(dq.length).toBe(0);
    expect(dq.isEmpty()).toBe(true);
  });

  it('initializes from an iterable', () => {
    const dq = new CircularDeque([1, 2, 3]);
    expect(dq.length).toBe(3);
    expect(dq.toArray()).toEqual([1, 2, 3]);
  });

  it('initializes from a Set (any iterable)', () => {
    const dq = new CircularDeque(new Set([10, 20, 30]));
    expect(dq.length).toBe(3);
  });

  it('accepts a numeric first argument as maxlen', () => {
    const dq = new CircularDeque<number>(4);
    expect(dq.getMaxLen()).toBe(4);
    expect(dq.isEmpty()).toBe(true);
  });

  it('accepts items + maxlen', () => {
    const dq = new CircularDeque([1, 2, 3, 4, 5], 3);
    expect(dq.length).toBe(3);
    expect(dq.getMaxLen()).toBe(3);
  });

  it('throws when maxlen (numeric) is <= 0', () => {
    expect(() => new CircularDeque<number>(0)).toThrow();
    expect(() => new CircularDeque<number>(-1)).toThrow();
  });

  it('throws when maxlen (second arg) is <= 0', () => {
    expect(() => new CircularDeque([1, 2], 0)).toThrow();
  });

  it('throws when initialCapacity is <= 0', () => {
    expect(() => new CircularDeque(undefined, undefined, 0)).toThrow();
  });
});

// ---------------------------------------------------------------------------
// addFront / addRear
// ---------------------------------------------------------------------------
describe('addFront', () => {
  it('adds items to the front', () => {
    const dq = new CircularDeque<number>();
    dq.addFront(1);
    dq.addFront(2);
    dq.addFront(3);
    expect(dq.toArray()).toEqual([3, 2, 1]);
  });

  it('increments length', () => {
    const dq = new CircularDeque<number>();
    dq.addFront(42);
    expect(dq.length).toBe(1);
  });

  it('evicts from the rear when at maxlen', () => {
    const dq = new CircularDeque<number>(3);
    dq.addRear(1);
    dq.addRear(2);
    dq.addRear(3);
    dq.addFront(0); // should evict 3 from rear
    expect(dq.toArray()).toEqual([0, 1, 2]);
    expect(dq.length).toBe(3);
  });
});

describe('addRear', () => {
  it('adds items to the rear', () => {
    const dq = new CircularDeque<number>();
    dq.addRear(1);
    dq.addRear(2);
    dq.addRear(3);
    expect(dq.toArray()).toEqual([1, 2, 3]);
  });

  it('increments length', () => {
    const dq = new CircularDeque<number>();
    dq.addRear(99);
    expect(dq.length).toBe(1);
  });

  it('evicts from the front when at maxlen', () => {
    const dq = new CircularDeque<number>(3);
    dq.addRear(1);
    dq.addRear(2);
    dq.addRear(3);
    dq.addRear(4); // should evict 1 from front
    expect(dq.toArray()).toEqual([2, 3, 4]);
    expect(dq.length).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// removeFront / removeRear
// ---------------------------------------------------------------------------
describe('removeFront', () => {
  it('returns undefined on empty deque', () => {
    expect(new CircularDeque<number>().removeFront()).toBeUndefined();
  });

  it('removes and returns the front item', () => {
    const dq = new CircularDeque([10, 20, 30]);
    expect(dq.removeFront()).toBe(10);
    expect(dq.toArray()).toEqual([20, 30]);
  });

  it('decrements length', () => {
    const dq = new CircularDeque([1, 2, 3]);
    dq.removeFront();
    expect(dq.length).toBe(2);
  });

  it('leaves deque empty after removing last element', () => {
    const dq = new CircularDeque([42]);
    dq.removeFront();
    expect(dq.isEmpty()).toBe(true);
  });
});

describe('removeRear', () => {
  it('returns undefined on empty deque', () => {
    expect(new CircularDeque<number>().removeRear()).toBeUndefined();
  });

  it('removes and returns the rear item', () => {
    const dq = new CircularDeque([10, 20, 30]);
    expect(dq.removeRear()).toBe(30);
    expect(dq.toArray()).toEqual([10, 20]);
  });

  it('decrements length', () => {
    const dq = new CircularDeque([1, 2, 3]);
    dq.removeRear();
    expect(dq.length).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// peekFront / peekRear
// ---------------------------------------------------------------------------
describe('peekFront', () => {
  it('returns undefined on empty deque', () => {
    expect(new CircularDeque<number>().peekFront()).toBeUndefined();
  });

  it('returns front without removing', () => {
    const dq = new CircularDeque([5, 10, 15]);
    expect(dq.peekFront()).toBe(5);
    expect(dq.length).toBe(3);
  });
});

describe('peekRear', () => {
  it('returns undefined on empty deque', () => {
    expect(new CircularDeque<number>().peekRear()).toBeUndefined();
  });

  it('returns rear without removing', () => {
    const dq = new CircularDeque([5, 10, 15]);
    expect(dq.peekRear()).toBe(15);
    expect(dq.length).toBe(3);
  });
});

// ---------------------------------------------------------------------------
// get
// ---------------------------------------------------------------------------
describe('get', () => {
  it('retrieves by positive index', () => {
    const dq = new CircularDeque(['a', 'b', 'c']);
    expect(dq.get(0)).toBe('a');
    expect(dq.get(1)).toBe('b');
    expect(dq.get(2)).toBe('c');
  });

  it('retrieves by negative index', () => {
    const dq = new CircularDeque(['a', 'b', 'c']);
    expect(dq.get(-1)).toBe('c');
    expect(dq.get(-2)).toBe('b');
    expect(dq.get(-3)).toBe('a');
  });

  it('returns undefined for out-of-range index', () => {
    const dq = new CircularDeque([1, 2, 3]);
    expect(dq.get(5)).toBeUndefined();
    expect(dq.get(-5)).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// contains
// ---------------------------------------------------------------------------
describe('contains', () => {
  it('returns true when item is present', () => {
    const dq = new CircularDeque([1, 2, 3]);
    expect(dq.contains(2)).toBe(true);
  });

  it('returns false when item is absent', () => {
    const dq = new CircularDeque([1, 2, 3]);
    expect(dq.contains(99)).toBe(false);
  });

  it('returns false on empty deque', () => {
    expect(new CircularDeque<number>().contains(1)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// extend / extendLeft
// ---------------------------------------------------------------------------
describe('extend', () => {
  it('appends items to the rear', () => {
    const dq = new CircularDeque([1, 2]);
    dq.extend([3, 4, 5]);
    expect(dq.toArray()).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles empty iterable', () => {
    const dq = new CircularDeque([1, 2]);
    dq.extend([]);
    expect(dq.toArray()).toEqual([1, 2]);
  });
});

describe('extendLeft', () => {
  it('prepends items preserving their order', () => {
    const dq = new CircularDeque([4, 5]);
    dq.extendLeft([1, 2, 3]);
    // extendLeft adds each to front in reverse, so order is preserved at front
    expect(dq.toArray()).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles empty iterable', () => {
    const dq = new CircularDeque([1, 2]);
    dq.extendLeft([]);
    expect(dq.toArray()).toEqual([1, 2]);
  });
});

// ---------------------------------------------------------------------------
// rotate
// ---------------------------------------------------------------------------
describe('rotate', () => {
  it('rotates right by default (n=1)', () => {
    const dq = new CircularDeque([1, 2, 3, 4, 5]);
    dq.rotate();
    expect(dq.toArray()).toEqual([5, 1, 2, 3, 4]);
  });

  it('rotates right by n', () => {
    const dq = new CircularDeque([1, 2, 3, 4, 5]);
    dq.rotate(2);
    expect(dq.toArray()).toEqual([4, 5, 1, 2, 3]);
  });

  it('rotates left with negative n', () => {
    const dq = new CircularDeque([1, 2, 3, 4, 5]);
    dq.rotate(-1);
    expect(dq.toArray()).toEqual([2, 3, 4, 5, 1]);
  });

  it('is a no-op on a deque with 0 or 1 elements', () => {
    const dq0 = new CircularDeque<number>();
    dq0.rotate();
    expect(dq0.toArray()).toEqual([]);

    const dq1 = new CircularDeque([42]);
    dq1.rotate();
    expect(dq1.toArray()).toEqual([42]);
  });

  it('handles rotation equal to length (full wrap)', () => {
    const dq = new CircularDeque([1, 2, 3]);
    dq.rotate(3);
    expect(dq.toArray()).toEqual([1, 2, 3]);
  });
});

// ---------------------------------------------------------------------------
// clear
// ---------------------------------------------------------------------------
describe('clear', () => {
  it('empties the deque', () => {
    const dq = new CircularDeque([1, 2, 3]);
    dq.clear();
    expect(dq.length).toBe(0);
    expect(dq.isEmpty()).toBe(true);
    expect(dq.toArray()).toEqual([]);
  });

  it('allows adding items after clear', () => {
    const dq = new CircularDeque([1, 2, 3]);
    dq.clear();
    dq.addRear(99);
    expect(dq.toArray()).toEqual([99]);
  });
});

// ---------------------------------------------------------------------------
// Capacity & resize
// ---------------------------------------------------------------------------
describe('Capacity / resize', () => {
  it('grows capacity when buffer is full (no maxlen)', () => {
    const dq = new CircularDeque<number>(undefined, undefined, 2);
    const initialCap = dq.getCapacity();
    for (let i = 0; i < initialCap + 1; i++) dq.addRear(i);
    expect(dq.getCapacity()).toBeGreaterThan(initialCap);
  });

  it('does not exceed maxlen capacity', () => {
    const dq = new CircularDeque<number>(4);
    for (let i = 0; i < 10; i++) dq.addRear(i);
    expect(dq.length).toBe(4);
    expect(dq.getCapacity()).toBeLessThanOrEqual(4);
  });

  it('trimToSize reduces capacity to fit contents', () => {
    const dq = new CircularDeque<number>(undefined, undefined, 16);
    dq.addRear(1);
    dq.addRear(2);
    const capBefore = dq.getCapacity();
    dq.trimToSize();
    expect(dq.getCapacity()).toBeLessThanOrEqual(capBefore);
    expect(dq.toArray()).toEqual([1, 2]);
  });
});

// ---------------------------------------------------------------------------
// Iterators
// ---------------------------------------------------------------------------
describe('Symbol.iterator', () => {
  it('iterates in front-to-rear order', () => {
    const dq = new CircularDeque([10, 20, 30]);
    expect([...dq]).toEqual([10, 20, 30]);
  });

  it('yields nothing for empty deque', () => {
    expect([...new CircularDeque<number>()]).toEqual([]);
  });
});

describe('reverseIterator', () => {
  it('iterates in rear-to-front order', () => {
    const dq = new CircularDeque([10, 20, 30]);
    expect([...dq.reverseIterator()]).toEqual([30, 20, 10]);
  });

  it('yields nothing for empty deque', () => {
    expect([...new CircularDeque<number>().reverseIterator()]).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Accessors
// ---------------------------------------------------------------------------
describe('Accessors', () => {
  it('length and size are equivalent', () => {
    const dq = new CircularDeque([1, 2, 3]);
    expect(dq.length).toBe(dq.size);
  });

  it('isEmpty returns true only when count is 0', () => {
    const dq = new CircularDeque<number>();
    expect(dq.isEmpty()).toBe(true);
    dq.addRear(1);
    expect(dq.isEmpty()).toBe(false);
    dq.removeFront();
    expect(dq.isEmpty()).toBe(true);
  });

  it('getMaxLen returns undefined when no maxlen set', () => {
    expect(new CircularDeque<number>().getMaxLen()).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// toArray
// ---------------------------------------------------------------------------
describe('toArray', () => {
  it('returns a copy, not a reference to internals', () => {
    const dq = new CircularDeque([1, 2, 3]);
    const arr = dq.toArray();
    arr.push(99);
    expect(dq.length).toBe(3);
  });

  it('returns elements in logical order after mixed operations', () => {
    const dq = new CircularDeque<number>();
    dq.addRear(2);
    dq.addFront(1);
    dq.addRear(3);
    expect(dq.toArray()).toEqual([1, 2, 3]);
  });
});

// ---------------------------------------------------------------------------
// Generics / type safety
// ---------------------------------------------------------------------------
describe('Generic types', () => {
  it('works with strings', () => {
    const dq = new CircularDeque(['hello', 'world']);
    expect(dq.peekFront()).toBe('hello');
  });

  it('works with objects', () => {
    const dq = new CircularDeque<{ id: number }>([{ id: 1 }, { id: 2 }]);
    expect(dq.removeFront()).toEqual({ id: 1 });
  });
});

// ---------------------------------------------------------------------------
// Stress / edge cases
// ---------------------------------------------------------------------------
describe('Stress & edge cases', () => {
  it('handles many add/remove cycles without corruption', () => {
    const dq = new CircularDeque<number>();
    for (let i = 0; i < 1000; i++) dq.addRear(i);
    for (let i = 0; i < 500; i++) dq.removeFront();
    expect(dq.length).toBe(500);
    expect(dq.peekFront()).toBe(500);
  });

  it('interleaved addFront/removeRear stays consistent', () => {
    const dq = new CircularDeque<number>();
    for (let i = 0; i < 100; i++) {
      dq.addFront(i);
      if (i % 3 === 0) dq.removeRear();
    }
    // Just verify no crash and length is sensible
    expect(dq.length).toBeGreaterThan(0);
    expect(dq.toArray().length).toBe(dq.length);
  });

  it('single element: peek, remove, add round-trip', () => {
    const dq = new CircularDeque<number>();
    dq.addFront(7);
    expect(dq.peekFront()).toBe(7);
    expect(dq.peekRear()).toBe(7);
    expect(dq.removeFront()).toBe(7);
    expect(dq.isEmpty()).toBe(true);
    dq.addRear(8);
    expect(dq.removeRear()).toBe(8);
    expect(dq.isEmpty()).toBe(true);
  });
});
