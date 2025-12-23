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

    // Update height
    this.updateHeight(node);

    // Get balance factor
    const balance = this.getBalance(node);

    // Left Left Case
    if (balance > 1 && this.compare(value, node.left!.value) < 0) {
      return this.rotateRight(node);
    }

    // Right Right Case
    if (balance < -1 && this.compare(value, node.right!.value) > 0) {
      return this.rotateLeft(node);
    }

    // Left Right Case
    if (balance > 1 && this.compare(value, node.left!.value) > 0) {
      node.left = this.rotateLeft(node.left!);
      return this.rotateRight(node);
    }

    // Right Left Case
    if (balance < -1 && this.compare(value, node.right!.value) < 0) {
      node.right = this.rotateRight(node.right!);
      return this.rotateLeft(node);
    }

    return node;
  }

  inOrder(): T[] {
    const result: T[] = [];

    this.inOrderTraversal(this.root, result);

    return result;
  }

  private inOrderTraversal(node: Node<T> | null, result: T[]): void {
    if (node) {
      this.inOrderTraversal(node.left, result);
      result.push(node.value);
      this.inOrderTraversal(node.right, result);
    }
  }

  isBalanced(): boolean {
    return this.checkBalance(this.root);
  }

  private checkBalance(node: Node<T> | null): boolean {
    if (!node) return true;

    // Calculate the balance factor of the current node
    const balanceFactor = Math.abs(this.getBalance(node));

    // The tree is balanced only if:
    // 1. Current node's balance factor is <= 1
    // 2. Left subtree is balanced
    // 3. Right subtree is balanced
    if (balanceFactor > 1) {
      return false;
    }

    return this.checkBalance(node.left) && this.checkBalance(node.right);
  }

  private getHeight(node: Node<T> | null): number {
    return node ? node.height : 0;
  }

  private getBalance(node: Node<T> | null): number {
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

  private findMin(node: Node<T>): Node<T> {
    while (node.left) {
      node = node.left;
    }

    return node;
  }

  getTreeHeight(): number {
    return this.getHeight(this.root);
  }

  isEmpty(): boolean {
    return this.root === null;
  }
}

export default AVLTree;
