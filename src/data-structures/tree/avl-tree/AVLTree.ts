class Node<T> {
  value: T;
  left: Node<T> | null = null;
  right: Node<T> | null = null;
  height: number = 1;

  constructor(value: T) {
    this.value = value;
  }
}

class AVLTree<T> {
  private root: Node<T> | null = null;
  private compare: (a: T, b: T) => number;

  constructor(compareFn?: (a: T, b: T) => number) {
    this.compare =
      compareFn ||
      ((a, b) => {
        if (a === b) return 0;
        if (typeof a === 'number' && typeof b === 'number') {
          return a - b;
        }
        if (typeof a === 'string' && typeof b === 'string') {
          return a.localeCompare(b);
        }
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
      });
  }
}

export default AVLTree;
