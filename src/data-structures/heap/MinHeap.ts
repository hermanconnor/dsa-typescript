class MinHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare?: (a: T, b: T) => number) {
    this.compare =
      compare ||
      ((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
          return a - b;
        }

        if (typeof a === 'string' && typeof b === 'string') {
          return a.localeCompare(b);
        }

        throw new Error(
          'Comparison function is required for non-numeric or non-string types.',
        );
      });
  }

  insert(value: T): void {
    this.heap.push(value);
    this.bubbleUp(this.heap.length - 1);
  }

  extractMin(): T | null {
    if (this.isEmpty()) return null;

    const min = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return min;
  }

  heapify(array: T[]): void {
    this.heap = [...array]; // Create a copy to avoid modifying the original array
    const n = this.heap.length;

    // Start from the last non-leaf node and bubble down
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.bubbleDown(i);
    }
  }

  peek(): T | null {
    return this.heap.length > 0 ? this.heap[0] : null;
  }

  size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(index: number): void {
    const parentIndex = Math.floor((index - 1) / 2);

    if (
      parentIndex >= 0 &&
      this.compare(this.heap[index], this.heap[parentIndex]) < 0
    ) {
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];

      this.bubbleUp(parentIndex);
    }
  }

  private bubbleDown(index: number): void {
    const leftChildIndex = 2 * index + 1;
    const rightChildIndex = 2 * index + 2;
    let smallest = index;

    if (
      leftChildIndex < this.heap.length &&
      this.compare(this.heap[leftChildIndex], this.heap[smallest]) < 0
    ) {
      smallest = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.compare(this.heap[rightChildIndex], this.heap[smallest]) < 0
    ) {
      smallest = rightChildIndex;
    }

    if (smallest !== index) {
      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];

      this.bubbleDown(smallest);
    }
  }
}

export default MinHeap;
