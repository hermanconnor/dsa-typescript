import Queue from '../../../data-structures/queue/list-queue/Queue';

/**
 * @class
 * @template T
 * @classdesc Represents a node in a Binary Tree.
 */
export class TreeNode<T> {
  /** The value stored in the node. */
  value: T;
  /** Reference to the left child node, or null if no left child exists. */
  left: TreeNode<T> | null;
  /** Reference to the right child node, or null if no right child exists. */
  right: TreeNode<T> | null;

  /**
   * Creates an instance of TreeNode.
   * @param {T} value - The value to store in the node.
   * @param {TreeNode<T> | null} [left=null] - The left child node.
   * @param {TreeNode<T> | null} [right=null] - The right child node.
   */
  constructor(
    value: T,
    left: TreeNode<T> | null = null,
    right: TreeNode<T> | null = null,
  ) {
    // Initialize the node's value
    this.value = value;
    // Initialize the left child reference
    this.left = left;
    // Initialize the right child reference
    this.right = right;
  }
}

/**
 * Performs a Level Order Traversal (Breadth-First Search) on a Binary Tree.
 * This implementation uses a custom Queue data structure.
 * *
 * * @template T
 * @param {TreeNode<T> | null} root - The root node of the binary tree.
 * @returns {T[][]} A two-dimensional array where each inner array contains the values
 * of the nodes at a specific level, from top to bottom, left to right.
 * * @complexity
 * - **Time Complexity:** O(N), where N is the number of nodes in the tree.
 * Each node is processed (enqueued and dequeued) exactly once.
 * - **Space Complexity:** O(W), where W is the maximum width of the tree (i.e., the maximum
 * number of nodes at any level). In the worst case (a complete binary tree), W can be O(N/2),
 * so the space complexity is often considered O(N) in the worst case for an unbalanced tree,
 * but more precisely, it's dominated by the space used by the queue and the result array.
 * The queue holds up to W nodes, and the result array holds N values. Thus, it's effectively O(N) overall.
 */
export function levelOrder<T>(root: TreeNode<T> | null): T[][] {
  // Base case: If the tree is empty (no root), return an empty array of levels.
  if (!root) return [];

  // Initialize the result array to store the node values, grouped by level.
  const result: T[][] = [];

  // Initialize the queue with the root node. This queue will hold nodes to be processed.
  // We use a custom Queue class here.
  const queue = new Queue<TreeNode<T>>([root]);

  // Continue the process as long as there are nodes in the queue.
  while (!queue.isEmpty()) {
    // Get the current number of nodes in the queue. This is the size of the current level.
    const levelSize = queue.size();
    // Initialize an array to store the values of nodes at the current level.
    const currentLevel: T[] = [];

    // Process all nodes at the current level.
    // By iterating exactly `levelSize` times, we ensure we only process the nodes
    // that were present in the queue at the start of this iteration.
    for (let i = 0; i < levelSize; i++) {
      // Dequeue the next node to process.
      // The '!' non-null assertion is used because we checked if the queue is empty
      // in the while loop and are iterating up to levelSize (which is <= queue size).
      const node = queue.dequeue()!;

      // Add the node's value to the current level's list.
      currentLevel.push(node.value);

      // Check if the node has a left child.
      if (node.left) {
        // Enqueue the left child for processing in the next level.
        queue.enqueue(node.left);
      }

      // Check if the node has a right child.
      if (node.right) {
        // Enqueue the right child for processing in the next level.
        queue.enqueue(node.right);
      }
    }

    // After processing all nodes at this level, add the level array to the final result.
    result.push(currentLevel);
  }

  // Return the complete list of levels.
  return result;
}

// --- Alternative Implementation using Array as a Queue ---

/**
 * Performs a Level Order Traversal (Breadth-First Search) on a Binary Tree.
 * This implementation uses a standard JavaScript array to simulate a queue,
 * leveraging `push` (enqueue) and `shift` (dequeue).
 * * @template T
 * @param {TreeNode<T> | null} root - The root node of the binary tree.
 * @returns {T[][]} A two-dimensional array where each inner array contains the values
 * of the nodes at a specific level, from top to bottom, left to right.
 * * @complexity
 * - **Time Complexity:** O(n²) in the worst case (where N is the number of nodes)
 * due to the use of `Array.prototype.shift()`. `shift()` has a time complexity of
 * O(k) where k is the array size, as all remaining elements must be re-indexed.
 * In the context of the whole traversal, this can lead to O(n²) overall.
 * If using a data structure optimized for O(1) dequeue (like a standard linked-list-based queue),
 * the time complexity is O(N).
 * - **Space Complexity:** O(W), where W is the maximum width of the tree.
 * This is equivalent to O(N) in the worst case (a complete binary tree).
 */
export function levelOrderArray<T>(root: TreeNode<T> | null): T[][] {
  // Base case: If the tree is empty (no root), return an empty array of levels.
  if (!root) return [];

  // Initialize the result array to store the node values, grouped by level.
  const result: T[][] = [];
  // Initialize the queue using a standard JavaScript array, starting with the root.
  // WARNING: Using Array.prototype.shift() for dequeuing can be inefficient (O(N) per operation).
  const queue: TreeNode<T>[] = [root];

  // Continue the process as long as the queue is not empty.
  while (queue.length > 0) {
    // Get the current number of nodes in the queue. This is the size of the current level.
    const levelSize = queue.length;
    // Initialize an array to store the values of nodes at the current level.
    const currentLevel: T[] = [];

    // Process all nodes at the current level.
    for (let i = 0; i < levelSize; i++) {
      // Dequeue the next node using `shift()`. This is an O(k) operation
      // which degrades performance significantly compared to a proper queue implementation.
      // The '!' non-null assertion is used because we checked `queue.length > 0`.
      const node = queue.shift()!;

      // Add the node's value to the current level's list.
      currentLevel.push(node.value);

      // Add children to queue for next level
      // Check for left child and enqueue it for the next level.
      if (node.left) queue.push(node.left);
      // Check for right child and enqueue it for the next level.
      if (node.right) queue.push(node.right);
    }

    // Add the collected values for the current level to the result.
    result.push(currentLevel);
  }

  // Return the complete list of levels.
  return result;
}
