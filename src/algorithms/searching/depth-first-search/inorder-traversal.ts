import { TreeNode } from './TreeNode';

/**
 * @function inorderTraversal
 * @template T The type of the node values.
 * @description Performs an In-order traversal of a binary tree using recursion (Depth-First Search).
 * In-order sequence: Left -> Root -> Right.
 * For binary search trees, this produces values in sorted (ascending) order.
 *
 * @param {TreeNode<T> | null} node The root node of the binary tree (or subtree).
 * @returns {T[]} An array containing the node values in in-order sequence.
 *
 * @complexity
 * **Time Complexity:** O(N), where N is the number of nodes in the tree. Every node is visited exactly once.
 * **Space Complexity:** O(H), where H is the height of the tree. This is due to the recursion stack. In the worst case (a skewed tree), H can be N, making it O(N).
 */
export function inorderTraversal<T>(node: TreeNode<T> | null): T[] {
  // Array to store the result of the traversal.
  const result: T[] = [];

  /**
   * Helper function to recursively traverse the tree.
   * @param {TreeNode<T> | null} node The current node being processed.
   */
  const traverse = (node: TreeNode<T> | null): void => {
    // Base case: If the current node is null, we stop.
    if (!node) return;

    // 1. Traverse Left: Recursively call traverse on the left child.
    traverse(node.left);

    // 2. Visit the Root: Add the current node's value to the result array.
    result.push(node.value);

    // 3. Traverse Right: Recursively call traverse on the right child.
    traverse(node.right);
  };

  // Start the traversal from the given root node.
  traverse(node);

  // Return the array of values collected in in-order.
  return result;
}

/**
 * @function inorderTraversalIterative
 * @template T The type of the node values.
 * @description Performs an In-order traversal of a binary tree using an iterative approach with a stack (Depth-First Search).
 * In-order sequence: Left -> Root -> Right.
 * For binary search trees, this produces values in sorted (ascending) order.
 *
 * @param {TreeNode<T> | null} node The root node of the binary tree.
 * @returns {T[]} An array containing the node values in in-order sequence.
 *
 * @complexity
 * **Time Complexity:** O(N), where N is the number of nodes in the tree. Every node is visited exactly once.
 * **Space Complexity:** O(H), where H is the height of the tree. This is due to the stack, which can hold up to H nodes at any point. In the worst case (a skewed tree), H can be N, making it O(N).
 */
export function inorderTraversalIterative<T>(node: TreeNode<T> | null): T[] {
  if (!node) return [];

  // Array to store the result of the traversal.
  const result: T[] = [];

  // Stack to manage the nodes to be visited.
  const stack: TreeNode<T>[] = [];

  // Current node pointer starts at the root.
  let current: TreeNode<T> | null = node;

  // Continue the loop as long as there are nodes to process.
  while (current !== null || stack.length > 0) {
    // 1. Traverse Left: Go as far left as possible, pushing all nodes onto the stack.
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }

    // 2. Visit the Root: Pop the top node from the stack (leftmost unvisited node).
    // The '!' is a non-null assertion operator because we checked stack.length > 0.
    current = stack.pop()!;

    // Add the current node's value to the result array.
    result.push(current.value);

    // 3. Traverse Right: Move to the right child.
    // If there's a right child, the outer loop will push its left children onto the stack.
    current = current.right;
  }

  // Return the array of values collected in in-order.
  return result;
}
