import { TreeNode } from './TreeNode';

/**
 * @function postorderTraversal
 * @template T The type of the node values.
 * @description Performs a Post-order traversal of a binary tree using recursion (Depth-First Search).
 * Post-order sequence: Left -> Right -> Root.
 * Useful for operations like deleting a tree, evaluating expression trees, or calculating directory sizes.
 *
 * @param {TreeNode<T> | null} node The root node of the binary tree (or subtree).
 * @returns {T[]} An array containing the node values in post-order sequence.
 *
 * @complexity
 * **Time Complexity:** O(N), where N is the number of nodes in the tree. Every node is visited exactly once.
 * **Space Complexity:** O(H), where H is the height of the tree. This is due to the recursion stack. In the worst case (a skewed tree), H can be N, making it O(N).
 */
export function postorderTraversal<T>(node: TreeNode<T> | null): T[] {
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

    // 2. Traverse Right: Recursively call traverse on the right child.
    traverse(node.right);

    // 3. Visit the Root: Add the current node's value to the result array.
    result.push(node.value);
  };

  // Start the traversal from the given root node.
  traverse(node);

  // Return the array of values collected in post-order.
  return result;
}

/**
 * @function postorderTraversalIterative
 * @template T The type of the node values.
 * @description Performs a Post-order traversal of a binary tree using an iterative approach with a stack (Depth-First Search).
 * Post-order sequence: Left -> Right -> Root.
 * Uses a two-stack approach for clarity: one for traversal, one for result ordering.
 *
 * @param {TreeNode<T> | null} node The root node of the binary tree.
 * @returns {T[]} An array containing the node values in post-order sequence.
 *
 * @complexity
 * **Time Complexity:** O(N), where N is the number of nodes in the tree. Every node is pushed and popped exactly once.
 * **Space Complexity:** O(N), where N is the number of nodes. We use two stacks that together can hold all nodes in the worst case.
 */
export function postorderTraversalIterative<T>(node: TreeNode<T> | null): T[] {
  // Handle the case where the tree is empty.
  if (!node) return [];

  // Array to store the result of the traversal.
  const result: T[] = [];

  // Primary stack for traversal (mimics Root -> Right -> Left).
  const stack1: TreeNode<T>[] = [node];

  // Secondary stack to reverse the order to Left -> Right -> Root.
  const stack2: TreeNode<T>[] = [];

  // Phase 1: Traverse in reverse post-order (Root -> Right -> Left) and push to stack2.
  while (stack1.length > 0) {
    const current = stack1.pop()!;

    // Push current node to stack2 (will be popped in reverse order).
    stack2.push(current);

    // Push left child first (so it's processed after right).
    if (current.left) {
      stack1.push(current.left);
    }

    // Push right child (so it's processed before left due to LIFO).
    if (current.right) {
      stack1.push(current.right);
    }
  }

  // Phase 2: Pop from stack2 to get post-order sequence (Left -> Right -> Root).
  while (stack2.length > 0) {
    const current = stack2.pop()!;
    result.push(current.value);
  }

  // Return the array of values collected in post-order.
  return result;
}

/**
 * @function postorderTraversalIterativeOptimized
 * @template T The type of the node values.
 * @description Performs a Post-order traversal using a single stack with a "last visited" tracker.
 * Post-order sequence: Left -> Right -> Root.
 * More space-efficient than the two-stack approach.
 *
 * @param {TreeNode<T> | null} node The root node of the binary tree.
 * @returns {T[]} An array containing the node values in post-order sequence.
 *
 * @complexity
 * **Time Complexity:** O(N), where N is the number of nodes in the tree. Every node is visited exactly once.
 * **Space Complexity:** O(H), where H is the height of the tree. The stack holds at most H nodes at any point.
 */
export function postorderTraversalIterativeOptimized<T>(
  node: TreeNode<T> | null,
): T[] {
  // Handle the case where the tree is empty.
  if (!node) return [];

  // Array to store the result of the traversal.
  const result: T[] = [];

  // Stack to manage the nodes to be visited.
  const stack: TreeNode<T>[] = [];

  // Track the last visited node to avoid revisiting.
  let lastVisited: TreeNode<T> | null = null;

  // Current node pointer starts at the root.
  let current: TreeNode<T> | null = node;

  while (current !== null || stack.length > 0) {
    // 1. Go as far left as possible, pushing all nodes onto the stack.
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }

    // Peek at the top of the stack (don't pop yet).
    const peekNode = stack[stack.length - 1];

    // 2. Check if we need to process the right subtree.
    // We can visit the node if: (a) it has no right child, or (b) we've already visited the right child.
    if (peekNode.right !== null && lastVisited !== peekNode.right) {
      // Move to the right child to process its subtree.
      current = peekNode.right;
    } else {
      // 3. Visit the node (both children have been processed).
      result.push(peekNode.value);
      lastVisited = stack.pop()!;
    }
  }

  // Return the array of values collected in post-order.
  return result;
}
