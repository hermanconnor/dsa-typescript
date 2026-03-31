/**
 * A Universal Heap implementation.
 * Supports Min-Heap or Max-Heap logic based on a custom comparator.
 * * Space Complexity: O(n) where n is the number of elements in the heap.
 * * @template T - The type of elements held in the heap.
 */
class Heap<T extends object | number | string> {
  private heap: T[] = [];
  private readonly compare: (a: T, b: T) => number;
  /** Maps values to their current index in the array for O(1) lookups */
  private valueToHeapIndex: Map<T, number> = new Map();

  /**
   * @param compare - Comparison function.
   * Min-Heap: (a, b) => a - b
   * Max-Heap: (a, b) => b - a
   */
  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

  /**
   * Static factory to build a heap from an existing array.
   * Time Complexity: O(n) using Floy's algorithm (bottom-up heapify).
   * Space Complexity: O(n) to store the internal array and map.
   */
  static fromArray<T extends object | number | string>(
    items: T[],
    compare: (a: T, b: T) => number,
  ): Heap<T> {
    const instance = new Heap<T>(compare);
    instance.heap = [...items];

    const n = instance.heap.length;

    for (let i = 0; i < n; i++) {
      instance.valueToHeapIndex.set(instance.heap[i], i);
    }

    for (let i = (instance.heap.length >> 1) - 1; i >= 0; i--) {
      instance.heapifyDown(i);
    }

    return instance;
  }

  /**
   * Adds a new value to the heap.
   * Time Complexity: O(log n)
   */
  insert(value: T): void {
    if (this.valueToHeapIndex.has(value)) return;

    this.heap.push(value);
    const idx = this.heap.length - 1;
    this.valueToHeapIndex.set(value, idx);

    this.heapifyUp(idx);
  }

  /**
   * Removes and returns the root (min or max) element.
   * Time Complexity: O(log n)
   */
  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;

    const top = this.heap[0];
    const last = this.heap.pop()!;
    this.valueToHeapIndex.delete(top);

    if (this.heap.length > 0) {
      // Move the last element to the root and bubble it down
      this.heap[0] = last;
      this.valueToHeapIndex.set(last, 0);
      this.heapifyDown(0);
    }

    return top;
  }

  /**
   * Removes an arbitrary element from the heap.
   * Time Complexity: O(log n) - Thanks to the internal Map lookup.
   */
  remove(value: T): boolean {
    const idx = this.valueToHeapIndex.get(value);

    if (idx === undefined) return false;

    const lastIdx = this.heap.length - 1;
    const lastItem = this.heap.pop()!;
    this.valueToHeapIndex.delete(value);

    if (idx < lastIdx) {
      // Replace target node with the last node
      this.heap[idx] = lastItem;
      this.valueToHeapIndex.set(lastItem, idx);

      // We don't know if lastItem is larger or smaller than the old parent,
      // so we try to move it in both directions.
      this.heapifyUp(idx);
      const newIdx = this.valueToHeapIndex.get(lastItem)!;
      this.heapifyDown(newIdx);
    }

    return true;
  }

  /**
   * Re-evaluates the position of a value if its priority has changed.
   * Time Complexity: O(log n)
   */
  update(value: T): void {
    const idx = this.valueToHeapIndex.get(value);
    if (idx === undefined) return;

    this.heapifyUp(idx);
    const updatedIdx = this.valueToHeapIndex.get(value)!;
    this.heapifyDown(updatedIdx);
  }

  /**
   * Creates a shallow copy of the heap.
   * Time Complexity: O(n)
   */
  clone(): Heap<T> {
    const cloned = new Heap<T>(this.compare);

    cloned.heap = [...this.heap];
    cloned.valueToHeapIndex = new Map(this.valueToHeapIndex);

    return cloned;
  }

  /** Time Complexity: O(1) */
  size(): number {
    return this.heap.length;
  }

  /** Time Complexity: O(1) */
  peek(): T | undefined {
    return this.heap[0];
  }

  clear(): void {
    this.heap = [];
    this.valueToHeapIndex.clear();
  }

  /**
   * Bubbles an element up to its correct position.
   * Time Complexity: O(log n)
   */
  private heapifyUp(idx: number): void {
    while (idx > 0) {
      const p = (idx - 1) >> 1;

      // If child is in correct order relative to parent, stop
      if (this.compare(this.heap[idx], this.heap[p]) >= 0) break;

      this.swap(idx, p);
      idx = p;
    }
  }

  /**
   * Bubbles an element down to its correct position.
   * Time Complexity: O(log n)
   */
  private heapifyDown(idx: number): void {
    const n = this.heap.length;

    while (true) {
      let best = idx;

      const l = (idx << 1) + 1; // Left child index
      const r = (idx << 1) + 2; // Right child index

      // Check if left child is "better" (smaller in min-heap) than current
      if (l < n && this.compare(this.heap[l], this.heap[best]) < 0) {
        best = l;
      }
      // Check if right child is "better" than current best
      if (r < n && this.compare(this.heap[r], this.heap[best]) < 0) {
        best = r;
      }

      if (best === idx) break;

      this.swap(idx, best);
      idx = best;
    }
  }

  /**
   * Swaps two elements in the array and updates the index Map.
   * Time Complexity: O(1)
   */
  private swap(i: number, j: number): void {
    const temp = this.heap[i];

    this.heap[i] = this.heap[j];
    this.heap[j] = temp;

    this.valueToHeapIndex.set(this.heap[i], i);
    this.valueToHeapIndex.set(this.heap[j], j);
  }

  /**
   * Iterates through the heap in priority order.
   * Note: This consumes a clone of the heap.
   * Time Complexity: O(n log n)
   */
  *[Symbol.iterator](): Iterator<T> {
    const clone = this.clone();
    while (clone.size() > 0) {
      yield clone.pop()!;
    }
  }
}

export default Heap;
