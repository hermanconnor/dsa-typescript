/**
 * Represents a node in the AVL Tree.
 */
class Node<T> {
  value: T;
  left: Node<T> | null = null;
  right: Node<T> | null = null;
  height: number = 1;

  constructor(value: T) {
    this.value = value;
  }
}

/**
 * A Self-Balancing Binary Search Tree (AVL).
 * * Time Complexities:
 * - Insert: O(log n)
 * - Delete: O(log n)
 * - Search: O(log n)
 * - IsBalanced: O(n)
 * * Space Complexity: O(n) to store the nodes.
 */
class AVLTree<T> {
  private root: Node<T> | null = null;
  private compare: (a: T, b: T) => number;

  /**
   * @param compareFn Optional custom comparison function.
   */
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

  /**
   * Searches for a value in the tree.
   * Time Complexity: O(log n)
   */
  search(value: T): boolean {
    let current = this.root;

    while (current) {
      const cmp = this.compare(value, current.value);
      if (cmp === 0) return true;

      current = cmp < 0 ? current.left : current.right;
    }

    return false;
  }

  /**
   * Inserts a value into the tree and rebalances.
   * Time Complexity: O(log n)
   */
  insert(value: T): void {
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(node: Node<T> | null, value: T): Node<T> {
    if (!node) return new Node(value);

    const cmp = this.compare(value, node.value);

    if (cmp < 0) {
      node.left = this.insertNode(node.left, value);
    } else if (cmp > 0) {
      node.right = this.insertNode(node.right, value);
    } else {
      // Duplicate values not allowed
      return node;
    }

    this.updateHeight(node);

    return this.rebalance(node);
  }

  /**
   * Performs rotations to fix balance factors > 1 or < -1.
   */
  private rebalance(node: Node<T>): Node<T> {
    const balance = this.getBalanceFactor(node);

    // Left Heavy
    if (balance > 1) {
      if (this.getBalanceFactor(node.left) < 0) {
        node.left = this.rotateLeft(node.left!);
      }

      return this.rotateRight(node);
    }

    // Right Heavy
    if (balance < -1) {
      if (this.getBalanceFactor(node.right) > 0) {
        node.right = this.rotateRight(node.right!);
      }

      return this.rotateLeft(node);
    }

    return node;
  }

  /**
   * Returns an array of values in sorted order.
   * Time Complexity: O(n)
   */
  inOrder(): T[] {
    const result: T[] = [];
    this.traverse(this.root, result);
    return result;
  }

  private traverse(node: Node<T> | null, result: T[]): void {
    if (!node) return;

    this.traverse(node.left, result);
    result.push(node.value);
    this.traverse(node.right, result);
  }

  /**
   * Validates if the tree maintains AVL balance properties.
   * Time Complexity: O(n)
   */
  isBalanced(): boolean {
    return this.checkBalanceRecursive(this.root);
  }

  private checkBalanceRecursive(node: Node<T> | null): boolean {
    if (!node) return true;

    const balance = this.getBalanceFactor(node);

    if (Math.abs(balance) > 1) return false;

    return (
      this.checkBalanceRecursive(node.left) &&
      this.checkBalanceRecursive(node.right)
    );
  }

  private getHeight(node: Node<T> | null): number {
    return node ? node.height : 0;
  }

  private getBalanceFactor(node: Node<T> | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  private updateHeight(node: Node<T>): void {
    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  private rotateLeft(x: Node<T>): Node<T> {
    const y = x.right!;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  private rotateRight(y: Node<T>): Node<T> {
    const x = y.left!;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  private getMin(node: Node<T>): Node<T> {
    let current = node;

    while (current.left) {
      current = current.left;
    }

    return current;
  }

  getTreeHeight(): number {
    return this.getHeight(this.root);
  }

  isEmpty(): boolean {
    return this.root === null;
  }
}

export default AVLTree;
