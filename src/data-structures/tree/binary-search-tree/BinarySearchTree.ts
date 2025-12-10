import Queue from '../../queue/list-queue/Queue';

/**
 * Represents a node in a binary search tree
 * @template T - The type of value stored in the node
 */
class TreeNode<T> {
  val: T;
  left: TreeNode<T> | null;
  right: TreeNode<T> | null;

  constructor(val: T) {
    this.val = val;
    this.left = null;
    this.right = null;
  }
}

/**
 * Implementation of a Binary Search Tree data structure
 * @template T - The type of values stored in the tree
 */
class BinarySearchTree<T> {
  private root: TreeNode<T> | null = null;
  private compareFn: (a: T, b: T) => number;

  /**
   * Creates a new Binary Search Tree
   * @param compareFn - Optional custom comparison function. Defaults to natural ordering with localeCompare for strings
   * @time O(1)
   * @space O(1)
   */
  constructor(compareFn?: (a: T, b: T) => number) {
    this.compareFn =
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
   * Inserts a value into the tree. Duplicates are not inserted.
   * @param val - The value to insert
   * @time O(log n) average case, O(n) worst case (unbalanced tree)
   * @space O(1) iterative implementation
   */
  insert(val: T): void {
    const newNode = new TreeNode(val);

    if (!this.root) {
      this.root = newNode;
      return;
    }

    let curr = this.root;
    while (true) {
      const cmp = this.compareFn(val, curr.val);

      if (cmp < 0) {
        if (!curr.left) {
          curr.left = newNode;
          return;
        }
        curr = curr.left;
      } else if (cmp > 0) {
        if (!curr.right) {
          curr.right = newNode;
          return;
        }
        curr = curr.right;
      } else {
        // Duplicate value - don't insert
        return;
      }
    }
  }

  /**
   * Searches for a value in the tree
   * @param val - The value to search for
   * @returns True if the value exists in the tree, false otherwise
   * @time O(log n) average case, O(n) worst case
   * @space O(1)
   */
  search(val: T): boolean {
    let curr = this.root;

    while (curr) {
      const cmp = this.compareFn(val, curr.val);

      if (cmp === 0) return true;
      curr = cmp < 0 ? curr.left : curr.right;
    }

    return false;
  }

  /**
   * Finds and returns the node containing the specified value
   * @param val - The value to find
   * @returns The TreeNode containing the value, or null if not found
   * @time O(log n) average case, O(n) worst case
   * @space O(1)
   */
  find(val: T): TreeNode<T> | null {
    let curr = this.root;

    while (curr) {
      const cmp = this.compareFn(val, curr.val);

      if (cmp === 0) return curr;
      curr = cmp < 0 ? curr.left : curr.right;
    }

    return null;
  }

  /**
   * Finds the minimum value in the tree
   * @returns The minimum value, or null if tree is empty
   * @time O(log n) average case, O(n) worst case
   * @space O(1)
   */
  findMin(): T | null {
    if (!this.root) return null;

    let curr = this.root;
    while (curr.left) {
      curr = curr.left;
    }

    return curr.val;
  }

  /**
   * Finds the maximum value in the tree
   * @returns The maximum value, or null if tree is empty
   * @time O(log n) average case, O(n) worst case
   * @space O(1)
   */
  findMax(): T | null {
    if (!this.root) return null;

    let curr = this.root;
    while (curr.right) {
      curr = curr.right;
    }

    return curr.val;
  }

  /**
   * Deletes a value from the tree
   * @param val - The value to delete
   * @returns True if the value was deleted, false if it wasn't found
   * @time O(log n) average case, O(n) worst case
   * @space O(log n) due to recursion stack
   */
  delete(val: T): boolean {
    const originalSize = this.size();
    this.root = this.deleteNode(this.root, val);

    return this.size() < originalSize;
  }

  /**
   * Helper method to recursively delete a node
   * @private
   */
  private deleteNode(node: TreeNode<T> | null, val: T): TreeNode<T> | null {
    if (!node) return null;

    const cmp = this.compareFn(val, node.val);

    if (cmp < 0) {
      node.left = this.deleteNode(node.left, val);
    } else if (cmp > 0) {
      node.right = this.deleteNode(node.right, val);
    } else {
      // Node to delete found

      // Case 1: No children
      if (!node.left && !node.right) return null;

      // Case 2: One child
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // Case 3: Two children - replace with inorder successor
      let successor = node.right;
      while (successor.left) {
        successor = successor.left;
      }
      node.val = successor.val;
      node.right = this.deleteNode(node.right, successor.val);
    }

    return node;
  }

  /**
   * Performs an in-order traversal of the tree (left-root-right)
   * Returns values in sorted order
   * @returns Array of values in sorted order
   * @time O(n)
   * @space O(n) for result array + O(log n) for recursion stack
   */
  inorder(): T[] {
    const result: T[] = [];
    this.inorderHelper(this.root, result);

    return result;
  }

  /**
   * Helper method for in-order traversal
   * @private
   */
  private inorderHelper(node: TreeNode<T> | null, result: T[]): void {
    if (!node) return;

    this.inorderHelper(node.left, result);
    result.push(node.val);
    this.inorderHelper(node.right, result);
  }

  /**
   * Performs a pre-order traversal of the tree (root-left-right)
   * @returns Array of values in pre-order
   * @time O(n)
   * @space O(n) for result array + O(log n) for recursion stack
   */
  preorder(): T[] {
    const result: T[] = [];
    this.preorderHelper(this.root, result);

    return result;
  }

  /**
   * Helper method for pre-order traversal
   * @private
   */
  private preorderHelper(node: TreeNode<T> | null, result: T[]): void {
    if (!node) return;

    result.push(node.val);
    this.preorderHelper(node.left, result);
    this.preorderHelper(node.right, result);
  }

  /**
   * Performs a post-order traversal of the tree (left-right-root)
   * @returns Array of values in post-order
   * @time O(n)
   * @space O(n) for result array + O(log n) for recursion stack
   */
  postorder(): T[] {
    const result: T[] = [];
    this.postorderHelper(this.root, result);

    return result;
  }

  /**
   * Helper method for post-order traversal
   * @private
   */
  private postorderHelper(node: TreeNode<T> | null, result: T[]): void {
    if (!node) return;
    this.postorderHelper(node.left, result);
    this.postorderHelper(node.right, result);

    result.push(node.val);
  }

  /**
   * Performs a level-order (breadth-first) traversal of the tree
   * Returns nodes grouped by level
   * @param Queue - Queue class to use for traversal
   * @returns Array of arrays, where each inner array represents one level
   * @time O(n)
   * @space O(w) where w is the maximum width of the tree
   */
  levelOrder(): T[][] {
    const result: T[][] = [];

    if (!this.root) return result;

    const queue = new Queue<TreeNode<T>>();
    queue.enqueue(this.root);

    while (!queue.isEmpty()) {
      const levelSize = queue.size();
      const currentLevel: T[] = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.dequeue();

        if (node) {
          currentLevel.push(node.val);

          if (node.left) {
            queue.enqueue(node.left);
          }

          if (node.right) {
            queue.enqueue(node.right);
          }
        }
      }

      result.push(currentLevel);
    }

    return result;
  }

  /**
   * Gets the height of the tree
   * @returns The height of the tree (-1 for empty tree, 0 for single node)
   * @time O(n)
   * @space O(log n) for recursion stack
   */
  height(): number {
    return this.getHeight(this.root);
  }

  /**
   * Helper method to calculate height recursively
   * @private
   */
  private getHeight(node: TreeNode<T> | null): number {
    if (!node) return -1;

    return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  /**
   * Checks if the tree is empty
   * @returns True if tree is empty, false otherwise
   * @time O(1)
   * @space O(1)
   */
  isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * Gets the total number of nodes in the tree
   * @returns The number of nodes
   * @time O(n)
   * @space O(log n) for recursion stack
   */
  size(): number {
    return this.getSize(this.root);
  }

  /**
   * Helper method to calculate size recursively
   * @private
   */
  private getSize(node: TreeNode<T> | null): number {
    if (!node) return 0;

    return 1 + this.getSize(node.left) + this.getSize(node.right);
  }

  /**
   * Validates that the tree maintains BST properties
   * @returns True if valid BST, false otherwise
   * @time O(n)
   * @space O(log n) for recursion stack
   */
  isValidBST(): boolean {
    return this.validateBST(this.root, null, null);
  }

  /**
   * Helper method to validate BST recursively
   * @private
   */
  private validateBST(
    node: TreeNode<T> | null,
    min: T | null,
    max: T | null,
  ): boolean {
    if (!node) return true;

    if (min !== null && this.compareFn(node.val, min) <= 0) return false;
    if (max !== null && this.compareFn(node.val, max) >= 0) return false;

    return (
      this.validateBST(node.left, min, node.val) &&
      this.validateBST(node.right, node.val, max)
    );
  }

  /**
   * Clears all nodes from the tree
   * @time O(1)
   * @space O(1)
   */
  clear(): void {
    this.root = null;
  }

  /**
   * Converts the tree to a sorted array
   * @returns Array of values in sorted order (in-order traversal)
   * @time O(n)
   * @space O(n)
   */
  toArray(): T[] {
    return this.inorder();
  }

  /**
   * Gets the root node (useful for testing)
   * @returns The root node or null
   * @time O(1)
   * @space O(1)
   */
  getRoot(): TreeNode<T> | null {
    return this.root;
  }
}

export default BinarySearchTree;
