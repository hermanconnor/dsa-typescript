class PriorityQueue<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(
    compare: (a: T, b: T) => number = (a, b) => (a > b ? 1 : a < b ? -1 : 0),
  ) {
    this.compare = compare;
  }

  enqueue(element: T): void {
    this.heap.push(element);
    this.heapifyUp(this.heap.length - 1);
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;
    if (this.heap.length === 1) return this.heap.pop();

    const root = this.heap[0];
    this.heap[0] = this.heap.pop()!;
    this.heapifyDown(0);

    return root;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  size(): number {
    return this.heap.length;
  }

  private getParentIndex(index: number): number {
    return Math.floor((index - 1) / 2);
  }

  private getLeftChildIndex(index: number): number {
    return 2 * index + 1;
  }

  private getRightChildIndex(index: number): number {
    return 2 * index + 2;
  }

  private swap(index1: number, index2: number): void {
    [this.heap[index1], this.heap[index2]] = [
      this.heap[index2],
      this.heap[index1],
    ];
  }

  private heapifyUp(index: number): void {
    while (
      index > 0 &&
      this.compare(this.heap[index], this.heap[this.getParentIndex(index)]) < 0
    ) {
      this.swap(index, this.getParentIndex(index));
      index = this.getParentIndex(index);
    }
  }

  private heapifyDown(index: number): void {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
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
      this.swap(index, smallest);
      this.heapifyDown(smallest);
    }
  }
}

export default PriorityQueue;
