class PriorityQueue<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(
    compare: (a: T, b: T) => number = (a, b) => (a > b ? 1 : a < b ? -1 : 0),
  ) {
    this.compare = compare;
  }

  enqueue(element: T): void {}

  dequeue(): T | undefined {}

  peek(): T | undefined {
    return this.heap[0];
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  size(): number {
    return this.heap.length;
  }
}

export default PriorityQueue;
