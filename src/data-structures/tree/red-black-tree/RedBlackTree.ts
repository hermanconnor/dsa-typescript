/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Color enum for Red-Black Tree nodes
 */
enum Color {
  RED,
  BLACK,
}

/**
 * Node class for Red-Black Tree
 * @template T - The type of data stored in the node
 */
class Node<T> {
  data: T;
  color: Color;
  left: Node<T>;
  right: Node<T>;
  parent: Node<T>;

  /**
   * Creates a new Red-Black Tree node
   * @param {T} data - The data to store in the node
   * @param {Node<T>} [nilNode] - The sentinel NIL node reference
   */
  constructor(data: T, nilNode?: Node<T>) {
    this.data = data;
    this.color = Color.RED;
    this.left = nilNode!;
    this.right = nilNode!;
    this.parent = nilNode!;
  }
}

/**
 * Red-Black Tree implementation
 * A self-balancing binary search tree that maintains the following properties:
 * 1. Every node is either red or black
 * 2. The root is black
 * 3. All leaves (NIL) are black
 * 4. If a node is red, then both its children are black
 * 5. All paths from a node to descendant NIL nodes contain the same number of black nodes
 *
 * @template T - The type of data stored in the tree
 */
class RedBlackTree<T> {
  private root: Node<T>;
  private nil: Node<T>;
  private compare: (a: T, b: T) => number;

  /**
   * Creates a new Red-Black Tree
   * @param {(a: T, b: T) => number} [compareFn] - Optional comparison function
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

    this.nil = new Node<T>(null as any);
    this.nil.color = Color.BLACK;
    this.nil.left = this.nil;
    this.nil.right = this.nil;
    this.nil.parent = this.nil;

    this.root = this.nil;
  }
}

export default RedBlackTree;
