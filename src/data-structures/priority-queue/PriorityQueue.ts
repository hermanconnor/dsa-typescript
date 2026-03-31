type PriorityMode = 'min' | 'max';

interface Entry<T> {
  value: T;
  priority: number;
  counter: number;
}

class PriorityQueue<T, K = T> {
  private heap: Entry<T>[] = [];
  private entryMap = new Map<K, number>();
  private counter = 0;

  private readonly isMin: boolean;
  private readonly getKey: (value: T) => K;

  constructor(
    mode: PriorityMode = 'max',
    keySelector: (value: T) => K = (v) => v as unknown as K,
  ) {
    this.isMin = mode === 'min';
    this.getKey = keySelector;
  }

  /** O(log n) Push or Update */
  push(value: T, priority: number): void {
    const key = this.getKey(value);
    const idx = this.entryMap.get(key);

    if (idx !== undefined) {
      this.updatePriority(value, priority);
      return;
    }

    const entry: Entry<T> = { value, priority, counter: this.counter++ };
    this.entryMap.set(key, this.heap.length);
    this.heap.push(entry);
    this.siftUp(this.heap.length - 1);
  }

  /** O(log n) Pop */
  pop(): T | undefined {
    if (this.empty) return undefined;

    const top = this.heap[0];
    this.entryMap.delete(this.getKey(top.value));

    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.entryMap.set(this.getKey(last.value), 0);
      this.siftDown(0);
    }

    return top.value;
  }

  peek(): T | undefined {
    return this.heap[0]?.value;
  }

  getPriority(value: T): number | undefined {
    const key = this.getKey(value);
    const idx = this.entryMap.get(key);

    if (idx === undefined) return undefined;

    return this.heap[idx].priority;
  }

  get size(): number {
    return this.heap.length;
  }

  get empty(): boolean {
    return this.heap.length === 0;
  }

  /** * O(n) Heapify - Much faster than pushing items one by one.
   * @param items The array of data
   * @param prioritySelector A function to tell the queue the priority of each item
   */
  static from<T, K = T>(
    items: T[],
    prioritySelector: (item: T) => number,
    mode: PriorityMode = 'max',
    keySelector: (value: T) => K = (v) => v as unknown as K,
  ): PriorityQueue<T, K> {
    const pq = new PriorityQueue<T, K>(mode, keySelector);

    // 1. Build the initial array and Map
    pq.heap = items.map((item, i) => {
      const entry = {
        value: item,
        priority: prioritySelector(item),
        counter: pq.counter++,
      };

      pq.entryMap.set(pq.getKey(item), i);

      return entry;
    });

    // 2. Sift down from the last non-leaf node (O(n) logic)
    for (let i = (pq.heap.length >> 1) - 1; i >= 0; i--) {
      pq.siftDown(i);
    }

    return pq;
  }

  private updatePriority(value: T, newPriority: number): void {
    const idx = this.entryMap.get(this.getKey(value))!;
    const oldPriority = this.heap[idx].priority;

    this.heap[idx].priority = newPriority;
    this.heap[idx].value = value;

    // Use internal comparison logic to decide whether to sift up or down
    const diff = this.isMin
      ? oldPriority - newPriority
      : newPriority - oldPriority;

    if (diff > 0) {
      this.siftUp(idx);
    } else {
      this.siftDown(idx);
    }
  }

  private compare(a: Entry<T>, b: Entry<T>): number {
    if (a.priority !== b.priority) {
      return this.isMin ? b.priority - a.priority : a.priority - b.priority;
    }

    return b.counter - a.counter;
  }

  private swap(i: number, j: number): void {
    const entryI = this.heap[i];
    const entryJ = this.heap[j];

    this.heap[i] = entryJ;
    this.heap[j] = entryI;

    this.entryMap.set(this.getKey(entryI.value), j);
    this.entryMap.set(this.getKey(entryJ.value), i);
  }

  private siftUp(i: number): void {
    while (i > 0) {
      const p = (i - 1) >> 1;

      if (this.compare(this.heap[i], this.heap[p]) > 0) {
        this.swap(i, p);
        i = p;
      } else {
        break;
      }
    }
  }

  private siftDown(i: number): void {
    const n = this.heap.length;

    while (true) {
      let best = i;
      const l = (i << 1) + 1;
      const r = (i << 1) + 2;

      if (l < n && this.compare(this.heap[l], this.heap[best]) > 0) best = l;
      if (r < n && this.compare(this.heap[r], this.heap[best]) > 0) best = r;

      if (best === i) break;

      this.swap(i, best);
      i = best;
    }
  }
}

export default PriorityQueue;
