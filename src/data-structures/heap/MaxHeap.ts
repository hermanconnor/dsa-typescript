class MaxHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(compare?: (a: T, b: T) => number) {
    this.compare =
      compare ||
      ((a, b) => {
        if (typeof a === 'number' && typeof b === 'number') {
          return b - a;
        }

        if (typeof a === 'string' && typeof b === 'string') {
          return b.localeCompare(a);
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

  // Changed name to extractMax
  extractMax(): T | null {
    if (this.isEmpty()) return null;

    const max = this.heap[0];
    const last = this.heap.pop()!;

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return max;
  }

  heapify(array: T[]): void {
    this.heap = [...array];
    const n = this.heap.length;

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
    let largest = index; // Changed to largest

    if (
      leftChildIndex < this.heap.length &&
      this.compare(this.heap[leftChildIndex], this.heap[largest]) < 0
    ) {
      largest = leftChildIndex;
    }

    if (
      rightChildIndex < this.heap.length &&
      this.compare(this.heap[rightChildIndex], this.heap[largest]) < 0
    ) {
      largest = rightChildIndex;
    }

    if (largest !== index) {
      [this.heap[index], this.heap[largest]] = [
        this.heap[largest],
        this.heap[index],
      ];

      this.bubbleDown(largest);
    }
  }
}

export default MaxHeap;
