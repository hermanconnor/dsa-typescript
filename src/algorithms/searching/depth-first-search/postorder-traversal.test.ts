import { describe, it, expect } from 'vitest';
import { TreeNode } from './TreeNode';
import {
  postorderTraversal,
  postorderTraversalIterative,
  postorderTraversalIterativeOptimized,
} from './postorder-traversal';

// Helper function to create a simple binary tree for testing
function createTree(): TreeNode<number> {
  //       1
  //      / \
  //     2   3
  //    / \
  //   4   5
  const root = new TreeNode(1);
  root.left = new TreeNode(2);
  root.right = new TreeNode(3);
  root.left.left = new TreeNode(4);
  root.left.right = new TreeNode(5);
  return root;
}

// Helper function to create a binary search tree
function createBST(): TreeNode<number> {
  //       4
  //      / \
  //     2   6
  //    / \ / \
  //   1  3 5  7
  const root = new TreeNode(4);
  root.left = new TreeNode(2);
  root.right = new TreeNode(6);
  root.left.left = new TreeNode(1);
  root.left.right = new TreeNode(3);
  root.right.left = new TreeNode(5);
  root.right.right = new TreeNode(7);
  return root;
}

// Helper function to create a left-skewed tree
function createLeftSkewedTree(): TreeNode<number> {
  //     1
  //    /
  //   2
  //  /
  // 3
  const root = new TreeNode(1);
  root.left = new TreeNode(2);
  root.left.left = new TreeNode(3);
  return root;
}

// Helper function to create a right-skewed tree
function createRightSkewedTree(): TreeNode<number> {
  // 1
  //  \
  //   2
  //    \
  //     3
  const root = new TreeNode(1);
  root.right = new TreeNode(2);
  root.right.right = new TreeNode(3);
  return root;
}

describe('postorderTraversal (Recursive)', () => {
  it('should return an empty array for an empty tree', () => {
    expect(postorderTraversal(null)).toEqual([]);
  });

  it('should return a single element for a tree with only a root node', () => {
    const root = new TreeNode(42);

    expect(postorderTraversal(root)).toEqual([42]);
  });

  it('should traverse a simple binary tree in post-order (Left -> Right -> Root)', () => {
    const root = createTree();
    // Expected: 4, 5, 2, 3, 1
    expect(postorderTraversal(root)).toEqual([4, 5, 2, 3, 1]);
  });

  it('should traverse a BST in post-order', () => {
    const root = createBST();
    // Expected: 1, 3, 2, 5, 7, 6, 4
    expect(postorderTraversal(root)).toEqual([1, 3, 2, 5, 7, 6, 4]);
  });

  it('should handle a left-skewed tree', () => {
    const root = createLeftSkewedTree();
    // Expected: 3, 2, 1
    expect(postorderTraversal(root)).toEqual([3, 2, 1]);
  });

  it('should handle a right-skewed tree', () => {
    const root = createRightSkewedTree();
    // Expected: 3, 2, 1
    expect(postorderTraversal(root)).toEqual([3, 2, 1]);
  });

  it('should handle a tree with only left child', () => {
    const root = new TreeNode(1);

    root.left = new TreeNode(2);

    expect(postorderTraversal(root)).toEqual([2, 1]);
  });

  it('should handle a tree with only right child', () => {
    const root = new TreeNode(1);

    root.right = new TreeNode(2);

    expect(postorderTraversal(root)).toEqual([2, 1]);
  });

  it('should work with string values', () => {
    const root = new TreeNode('B');

    root.left = new TreeNode('A');
    root.right = new TreeNode('C');

    expect(postorderTraversal(root)).toEqual(['A', 'C', 'B']);
  });

  it('should handle a complex tree', () => {
    //         10
    //        /  \
    //       5    15
    //      / \   / \
    //     3   7 12  20
    //    /     \
    //   1       9
    const root = new TreeNode(10);
    root.left = new TreeNode(5);
    root.right = new TreeNode(15);
    root.left.left = new TreeNode(3);
    root.left.right = new TreeNode(7);
    root.right.left = new TreeNode(12);
    root.right.right = new TreeNode(20);
    root.left.left.left = new TreeNode(1);
    root.left.right.right = new TreeNode(9);

    // Expected: 1, 3, 9, 7, 5, 12, 20, 15, 10
    expect(postorderTraversal(root)).toEqual([1, 3, 9, 7, 5, 12, 20, 15, 10]);
  });

  it('should demonstrate use case: deleting nodes in safe order', () => {
    // Post-order ensures children are processed before parent
    const root = new TreeNode('root');

    root.left = new TreeNode('left-child');
    root.right = new TreeNode('right-child');

    // If we were deleting: children first, then parent
    expect(postorderTraversal(root)).toEqual([
      'left-child',
      'right-child',
      'root',
    ]);
  });
});

describe('postorderTraversalIterative (Two-Stack Approach)', () => {
  it('should return an empty array for an empty tree', () => {
    expect(postorderTraversalIterative(null)).toEqual([]);
  });

  it('should return a single element for a tree with only a root node', () => {
    const root = new TreeNode(42);

    expect(postorderTraversalIterative(root)).toEqual([42]);
  });

  it('should traverse a simple binary tree in post-order (Left -> Right -> Root)', () => {
    const root = createTree();
    // Expected: 4, 5, 2, 3, 1
    expect(postorderTraversalIterative(root)).toEqual([4, 5, 2, 3, 1]);
  });

  it('should traverse a BST in post-order', () => {
    const root = createBST();
    // Expected: 1, 3, 2, 5, 7, 6, 4
    expect(postorderTraversalIterative(root)).toEqual([1, 3, 2, 5, 7, 6, 4]);
  });

  it('should handle a left-skewed tree', () => {
    const root = createLeftSkewedTree();
    // Expected: 3, 2, 1
    expect(postorderTraversalIterative(root)).toEqual([3, 2, 1]);
  });

  it('should handle a right-skewed tree', () => {
    const root = createRightSkewedTree();
    // Expected: 3, 2, 1
    expect(postorderTraversalIterative(root)).toEqual([3, 2, 1]);
  });

  it('should handle a tree with only left child', () => {
    const root = new TreeNode(1);

    root.left = new TreeNode(2);

    expect(postorderTraversalIterative(root)).toEqual([2, 1]);
  });

  it('should handle a tree with only right child', () => {
    const root = new TreeNode(1);

    root.right = new TreeNode(2);

    expect(postorderTraversalIterative(root)).toEqual([2, 1]);
  });

  it('should work with string values', () => {
    const root = new TreeNode('B');

    root.left = new TreeNode('A');
    root.right = new TreeNode('C');

    expect(postorderTraversalIterative(root)).toEqual(['A', 'C', 'B']);
  });

  it('should handle a complex tree', () => {
    //         10
    //        /  \
    //       5    15
    //      / \   / \
    //     3   7 12  20
    //    /     \
    //   1       9
    const root = new TreeNode(10);
    root.left = new TreeNode(5);
    root.right = new TreeNode(15);
    root.left.left = new TreeNode(3);
    root.left.right = new TreeNode(7);
    root.right.left = new TreeNode(12);
    root.right.right = new TreeNode(20);
    root.left.left.left = new TreeNode(1);
    root.left.right.right = new TreeNode(9);

    // Expected: 1, 3, 9, 7, 5, 12, 20, 15, 10
    expect(postorderTraversalIterative(root)).toEqual([
      1, 3, 9, 7, 5, 12, 20, 15, 10,
    ]);
  });
});

describe('postorderTraversalIterativeOptimized (Single-Stack Approach)', () => {
  it('should return an empty array for an empty tree', () => {
    expect(postorderTraversalIterativeOptimized(null)).toEqual([]);
  });

  it('should return a single element for a tree with only a root node', () => {
    const root = new TreeNode(42);

    expect(postorderTraversalIterativeOptimized(root)).toEqual([42]);
  });

  it('should traverse a simple binary tree in post-order (Left -> Right -> Root)', () => {
    const root = createTree();
    // Expected: 4, 5, 2, 3, 1
    expect(postorderTraversalIterativeOptimized(root)).toEqual([4, 5, 2, 3, 1]);
  });

  it('should traverse a BST in post-order', () => {
    const root = createBST();
    // Expected: 1, 3, 2, 5, 7, 6, 4
    expect(postorderTraversalIterativeOptimized(root)).toEqual([
      1, 3, 2, 5, 7, 6, 4,
    ]);
  });

  it('should handle a left-skewed tree', () => {
    const root = createLeftSkewedTree();
    // Expected: 3, 2, 1
    expect(postorderTraversalIterativeOptimized(root)).toEqual([3, 2, 1]);
  });

  it('should handle a right-skewed tree', () => {
    const root = createRightSkewedTree();
    // Expected: 3, 2, 1
    expect(postorderTraversalIterativeOptimized(root)).toEqual([3, 2, 1]);
  });

  it('should handle a tree with only left child', () => {
    const root = new TreeNode(1);

    root.left = new TreeNode(2);

    expect(postorderTraversalIterativeOptimized(root)).toEqual([2, 1]);
  });

  it('should handle a tree with only right child', () => {
    const root = new TreeNode(1);

    root.right = new TreeNode(2);

    expect(postorderTraversalIterativeOptimized(root)).toEqual([2, 1]);
  });

  it('should work with string values', () => {
    const root = new TreeNode('B');

    root.left = new TreeNode('A');
    root.right = new TreeNode('C');

    expect(postorderTraversalIterativeOptimized(root)).toEqual(['A', 'C', 'B']);
  });

  it('should handle a complex tree', () => {
    //         10
    //        /  \
    //       5    15
    //      / \   / \
    //     3   7 12  20
    //    /     \
    //   1       9
    const root = new TreeNode(10);

    root.left = new TreeNode(5);
    root.right = new TreeNode(15);
    root.left.left = new TreeNode(3);
    root.left.right = new TreeNode(7);
    root.right.left = new TreeNode(12);
    root.right.right = new TreeNode(20);
    root.left.left.left = new TreeNode(1);
    root.left.right.right = new TreeNode(9);

    // Expected: 1, 3, 9, 7, 5, 12, 20, 15, 10
    expect(postorderTraversalIterativeOptimized(root)).toEqual([
      1, 3, 9, 7, 5, 12, 20, 15, 10,
    ]);
  });
});

describe('All Implementations Consistency', () => {
  it('should produce identical results across all three implementations', () => {
    const root = createTree();
    const recursiveResult = postorderTraversal(root);
    const iterativeResult = postorderTraversalIterative(root);
    const optimizedResult = postorderTraversalIterativeOptimized(root);

    expect(recursiveResult).toEqual(iterativeResult);
    expect(recursiveResult).toEqual(optimizedResult);
  });

  it('should produce identical results for a BST', () => {
    const root = createBST();
    const recursiveResult = postorderTraversal(root);
    const iterativeResult = postorderTraversalIterative(root);
    const optimizedResult = postorderTraversalIterativeOptimized(root);

    expect(recursiveResult).toEqual(iterativeResult);
    expect(recursiveResult).toEqual(optimizedResult);
  });

  it('should produce identical results for edge cases', () => {
    expect(postorderTraversal(null)).toEqual(postorderTraversalIterative(null));
    expect(postorderTraversal(null)).toEqual(
      postorderTraversalIterativeOptimized(null),
    );

    const single = new TreeNode(1);
    expect(postorderTraversal(single)).toEqual(
      postorderTraversalIterative(single),
    );
    expect(postorderTraversal(single)).toEqual(
      postorderTraversalIterativeOptimized(single),
    );
  });

  it('should produce identical results for complex trees', () => {
    const root = new TreeNode(10);

    root.left = new TreeNode(5);
    root.right = new TreeNode(15);
    root.left.left = new TreeNode(3);
    root.left.right = new TreeNode(7);
    root.right.left = new TreeNode(12);
    root.right.right = new TreeNode(20);
    root.left.left.left = new TreeNode(1);
    root.left.right.right = new TreeNode(9);

    const recursiveResult = postorderTraversal(root);
    const iterativeResult = postorderTraversalIterative(root);
    const optimizedResult = postorderTraversalIterativeOptimized(root);

    expect(recursiveResult).toEqual(iterativeResult);
    expect(recursiveResult).toEqual(optimizedResult);
  });
});
