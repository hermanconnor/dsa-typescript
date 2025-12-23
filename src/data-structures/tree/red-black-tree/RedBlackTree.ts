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

    this.nil = new Node<T>(null as unknown as T);
    this.nil.color = Color.BLACK;
    this.nil.left = this.nil;
    this.nil.right = this.nil;
    this.nil.parent = this.nil;

    this.root = this.nil;
  }

  /**
   * Searches for a value in the tree
   * @param {T} data - The data to search for
   * @returns {boolean} True if the value exists in the tree
   * @time O(log n) - average and worst case due to balanced tree
   * @space O(1) - iterative implementation uses constant space
   */
  search(data: T): boolean {
    let current = this.root;

    while (current !== this.nil) {
      const cmp = this.compare(data, current.data);

      if (cmp === 0) return true;

      current = cmp < 0 ? current.left : current.right;
    }

    return false;
  }

  /**
   * Inserts a new value into the Red-Black Tree
   * @param {T} data - The data to insert
   * @time O(log n) - where n is the number of nodes in the tree
   * @space O(1) - constant space for the iterative approach
   */
  insert(data: T): void {
    const newNode = new Node(data, this.nil);

    let parent = this.nil;
    let current = this.root;

    while (current !== this.nil) {
      parent = current;
      const cmp = this.compare(data, current.data);

      if (cmp < 0) {
        current = current.left;
      } else if (cmp > 0) {
        current = current.right;
      } else {
        return;
      }
    }

    newNode.parent = parent;

    if (parent === this.nil) {
      this.root = newNode;
    } else if (this.compare(newNode.data, parent.data) < 0) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }

    this.fixInsert(newNode);
  }

  /**
   * Fixes Red-Black Tree properties after insertion
   * @param {Node<T>} node - The newly inserted node
   * @time O(log n) - at most O(log n) rotations and recolorings
   * @space O(1)
   * @private
   */
  private fixInsert(node: Node<T>): void {
    while (node.parent.color === Color.RED) {
      if (node.parent === node.parent.parent.left) {
        const uncle = node.parent.parent.right;

        if (uncle.color === Color.RED) {
          node.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            node = node.parent;
            this.rotateLeft(node);
          }

          node.parent.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          this.rotateRight(node.parent.parent);
        }
      } else {
        const uncle = node.parent.parent.left;

        if (uncle.color === Color.RED) {
          node.parent.color = Color.BLACK;
          uncle.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            this.rotateRight(node);
          }

          node.parent.color = Color.BLACK;
          node.parent.parent.color = Color.RED;
          this.rotateLeft(node.parent.parent);
        }
      }
    }

    this.root.color = Color.BLACK;
  }

  /**
   * Gets the physical height of the tree
   * @returns {number} The height of the tree
   * @time O(n) - must visit all nodes
   * @space O(log n) - recursion stack depth
   */
  getHeight(): number {
    return this.getHeightHelper(this.root);
  }

  /**
   * Helper function to calculate tree height
   * @param {Node<T>} node - Current node
   * @returns {number} Height of the subtree
   * @time O(n)
   * @space O(log n)
   * @private
   */
  private getHeightHelper(node: Node<T>): number {
    if (node === this.nil) return 0;

    return (
      1 +
      Math.max(
        this.getHeightHelper(node.left),
        this.getHeightHelper(node.right),
      )
    );
  }

  /**
   * Performs a left rotation around node x
   * @param {Node<T>} x - The node to rotate around
   * @time O(1)
   * @space O(1)
   * @private
   */
  private rotateLeft(x: Node<T>): void {
    const y = x.right;
    x.right = y.left;

    if (y.left !== this.nil) {
      y.left.parent = x;
    }

    y.parent = x.parent;

    if (x.parent === this.nil) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }

    y.left = x;
    x.parent = y;
  }

  /**
   * Performs a right rotation around node y
   * @param {Node<T>} y - The node to rotate around
   * @time O(1)
   * @space O(1)
   * @private
   */
  private rotateRight(y: Node<T>): void {
    const x = y.left;
    y.left = x.right;

    if (x.right !== this.nil) {
      x.right.parent = y;
    }

    x.parent = y.parent;

    if (y.parent === this.nil) {
      this.root = x;
    } else if (y === y.parent.right) {
      y.parent.right = x;
    } else {
      y.parent.left = x;
    }

    x.right = y;
    y.parent = x;
  }

  /**
   * Validates that the tree maintains Red-Black Tree properties
   * @returns {boolean} True if the tree is a valid Red-Black Tree
   * @time O(n) - must visit all nodes to validate
   * @space O(log n) - recursion stack depth
   */
  isValid(): boolean {
    try {
      this.validate(this.root);

      return this.root === this.nil || this.root.color === Color.BLACK;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  }

  /**
   * Helper function to validate Red-Black Tree properties recursively
   * @param {Node<T>} node - The node to validate
   * @returns {number} The black height of the subtree
   * @throws {Error} If a Red-Black Tree property is violated
   * @time O(n)
   * @space O(log n)
   * @private
   */
  private validate(node: Node<T>): number {
    if (node === this.nil) return 1;

    if (node.color === Color.RED) {
      if (node.left.color === Color.RED || node.right.color === Color.RED) {
        throw new Error('Double Red Violation');
      }
    }

    const leftHeight = this.validate(node.left);
    const rightHeight = this.validate(node.right);

    if (leftHeight !== rightHeight) {
      throw new Error('Black Height Inconsistency');
    }

    return leftHeight + (node.color === Color.BLACK ? 1 : 0);
  }
}

export default RedBlackTree;
