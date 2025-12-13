import { TreeNode } from './TreeNode';

/**
 * @function preorderTraversal
 * @template T The type of the node values.
 * @description Performs a Pre-order traversal of a binary tree using recursion (Depth-First Search).
 * Pre-order sequence: Root -> Left -> Right.
 *
 *
 *
 * @param {TreeNode<T> | null} node The root node of the binary tree (or subtree).
 * @returns {T[]} An array containing the node values in pre-order sequence.
 *
 * @complexity
 * **Time Complexity:** O(N), where N is the number of nodes in the tree. Every node is visited exactly once.
 * **Space Complexity:** O(H), where $H$ is the height of the tree. This is due to the recursion stack. In the worst case (a skewed tree), $H$ can be N, making it O(N).
 */
export function preorderTraversal<T>(node: TreeNode<T> | null): T[] {
  // Array to store the result of the traversal.
  const result: T[] = [];

  /**
   * Helper function to recursively traverse the tree.
   * @param {TreeNode<T> | null} node The current node being processed.
   */
  const traverse = (node: TreeNode<T> | null): void => {
    // Base case: If the current node is null, we stop.
    if (!node) return;

    // 1. Visit the Root: Add the current node's value to the result array.
    result.push(node.value);

    // 2. Traverse Left: Recursively call traverse on the left child.
    traverse(node.left);

    // 3. Traverse Right: Recursively call traverse on the right child.
    traverse(node.right);
  };

  // Start the traversal from the given root node.
  traverse(node);

  // Return the array of values collected in pre-order.
  return result;
}

/**
 * @function preorderTraversalIterative
 * @template T The type of the node values.
 * @description Performs a Pre-order traversal of a binary tree using an iterative approach with a stack (Depth-First Search).
 * Pre-order sequence: Root -> Left -> Right.
 *
 *
 *
 * @param {TreeNode<T> | null} node The root node of the binary tree.
 * @returns {T[]} An array containing the node values in pre-order sequence.
 *
 * @complexity
 * **Time Complexity:** O(N), where N is the number of nodes in the tree. Every node is pushed and popped exactly once.
 * **Space Complexity:** O(H), where H is the height of the tree. This is due to the stack, which can hold up to H nodes at any point. In the worst case (a skewed tree), H can be N, making it O(N).
 */
export function preorderTraversalIterative<T>(node: TreeNode<T> | null): T[] {
  // Handle the case where the tree is empty.
  if (!node) return [];

  // Array to store the result of the traversal.
  const result: T[] = [];
  // Stack to manage the nodes to be visited. Initialize with the root node.
  const stack: TreeNode<T>[] = [node];

  // Continue the loop as long as there are nodes in the stack.
  while (stack.length > 0) {
    // 1. Visit the Root: Pop the top node (which is the next node to process).
    // The '!' is a non-null assertion operator because we checked stack.length > 0.
    const current = stack.pop()!;

    // Add the current node's value to the result array.
    result.push(current.value);

    // 3. Traverse Right: Push the right child onto the stack.
    // We push 'right' first...
    if (current.right) {
      stack.push(current.right);
    }

    // 2. Traverse Left: Push the left child onto the stack.
    // ...so that 'left' is popped and processed *before* 'right'
    // (LIFO principle of the stack achieves the Root -> Left -> Right order).
    if (current.left) {
      stack.push(current.left);
    }
  }

  // Return the array of values collected in pre-order.
  return result;
}
