class MinHeap<T> {
  private heap: T[] = [];
  private compare: (a: T, b: T) => number;

  constructor(
    compareFn: (a: T, b: T) => number = (a, b) => (a > b ? 1 : a < b ? -1 : 0),
  ) {
    this.compare = compareFn;
  }

  insert(value: T): void {}
}

export default MinHeap;
