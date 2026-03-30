/**
 * A Universal Heap.
 * Min-Heap: (a, b) => a - b
 * Max-Heap: (a, b) => b - a
 */
class Heap<T extends object | number | string> {
  private heap: T[] = [];
  private readonly compare: (a: T, b: T) => number;
  private valueToHeapIndex: Map<T, number> = new Map();

  constructor(compare: (a: T, b: T) => number) {
    this.compare = compare;
  }

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

  insert(value: T): void {
    if (this.valueToHeapIndex.has(value)) return;

    this.heap.push(value);
    const idx = this.heap.length - 1;
    this.valueToHeapIndex.set(value, idx);

    this.heapifyUp(idx);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;

    const top = this.heap[0];
    const last = this.heap.pop()!;
    this.valueToHeapIndex.delete(top);

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.valueToHeapIndex.set(last, 0);
      this.heapifyDown(0);
    }

    return top;
  }

  remove(value: T): boolean {
    const idx = this.valueToHeapIndex.get(value);

    if (idx === undefined) return false;

    const lastIdx = this.heap.length - 1;
    const lastItem = this.heap.pop()!;
    this.valueToHeapIndex.delete(value);

    if (idx < lastIdx) {
      this.heap[idx] = lastItem;
      this.valueToHeapIndex.set(lastItem, idx);

      this.heapifyUp(idx);

      // Check the Map again because heapifyUp might have moved lastItem
      const newIdx = this.valueToHeapIndex.get(lastItem)!;
      this.heapifyDown(newIdx);
    }

    return true;
  }

  update(value: T): void {
    const idx = this.valueToHeapIndex.get(value);
    if (idx === undefined) return;

    // We don't know if it needs to go up or down, so we try both.
    // Only one (or neither) will actually move the element.
    this.heapifyUp(idx);
    this.heapifyDown(this.valueToHeapIndex.get(value)!);
  }

  clone(): Heap<T> {
    const cloned = new Heap<T>(this.compare);

    cloned.heap = [...this.heap];
    cloned.valueToHeapIndex = new Map(this.valueToHeapIndex);

    return cloned;
  }

  size(): number {
    return this.heap.length;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  private heapifyUp(idx: number): void {
    while (idx > 0) {
      const p = (idx - 1) >> 1;

      if (this.compare(this.heap[idx], this.heap[p]) >= 0) break;

      this.swap(idx, p);
      idx = p;
    }
  }

  private heapifyDown(idx: number): void {
    const n = this.heap.length;

    while (true) {
      let best = idx;

      const l = (idx << 1) + 1;
      const r = (idx << 1) + 2;

      if (l < n && this.compare(this.heap[l], this.heap[best]) < 0) {
        best = l;
      }
      if (r < n && this.compare(this.heap[r], this.heap[best]) < 0) {
        best = r;
      }

      if (best === idx) break;

      this.swap(idx, best);
      idx = best;
    }
  }

  private swap(i: number, j: number): void {
    const temp = this.heap[i];

    this.heap[i] = this.heap[j];
    this.heap[j] = temp;

    this.valueToHeapIndex.set(this.heap[i], i);
    this.valueToHeapIndex.set(this.heap[j], j);
  }

  *[Symbol.iterator](): Iterator<T> {
    const clone = this.clone();
    while (clone.size() > 0) {
      yield clone.pop()!;
    }
  }
}

export default Heap;
