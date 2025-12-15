import { describe, it, expect } from 'vitest';
import { TreeNode } from './TreeNode';
import {
  inorderTraversal,
  inorderTraversalIterative,
} from './inorder-traversal';

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
  //   1
  //  /
  // 2
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

describe('inorderTraversal (Recursive)', () => {
  it('should return an empty array for an empty tree', () => {
    expect(inorderTraversal(null)).toEqual([]);
  });

  it('should return a single element for a tree with only a root node', () => {
    const root = new TreeNode(42);

    expect(inorderTraversal(root)).toEqual([42]);
  });

  it('should traverse a simple binary tree in in-order (Left -> Root -> Right)', () => {
    const root = createTree();
    // Expected: 4, 2, 5, 1, 3
    expect(inorderTraversal(root)).toEqual([4, 2, 5, 1, 3]);
  });

  it('should traverse a BST in sorted order', () => {
    const root = createBST();
    // Expected: 1, 2, 3, 4, 5, 6, 7
    expect(inorderTraversal(root)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should handle a left-skewed tree', () => {
    const root = createLeftSkewedTree();
    // Expected: 3, 2, 1
    expect(inorderTraversal(root)).toEqual([3, 2, 1]);
  });

  it('should handle a right-skewed tree', () => {
    const root = createRightSkewedTree();
    // Expected: 1, 2, 3
    expect(inorderTraversal(root)).toEqual([1, 2, 3]);
  });

  it('should handle a tree with only left child', () => {
    const root = new TreeNode(1);

    root.left = new TreeNode(2);

    expect(inorderTraversal(root)).toEqual([2, 1]);
  });

  it('should handle a tree with only right child', () => {
    const root = new TreeNode(1);

    root.right = new TreeNode(2);

    expect(inorderTraversal(root)).toEqual([1, 2]);
  });

  it('should work with string values', () => {
    const root = new TreeNode('B');

    root.left = new TreeNode('A');
    root.right = new TreeNode('C');

    expect(inorderTraversal(root)).toEqual(['A', 'B', 'C']);
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

    // Expected: 1, 3, 5, 7, 9, 10, 12, 15, 20
    expect(inorderTraversal(root)).toEqual([1, 3, 5, 7, 9, 10, 12, 15, 20]);
  });
});

describe('inorderTraversalIterative (Iterative)', () => {
  it('should return an empty array for an empty tree', () => {
    expect(inorderTraversalIterative(null)).toEqual([]);
  });

  it('should return a single element for a tree with only a root node', () => {
    const root = new TreeNode(42);
    expect(inorderTraversalIterative(root)).toEqual([42]);
  });

  it('should traverse a simple binary tree in in-order (Left -> Root -> Right)', () => {
    const root = createTree();
    // Expected: 4, 2, 5, 1, 3
    expect(inorderTraversalIterative(root)).toEqual([4, 2, 5, 1, 3]);
  });

  it('should traverse a BST in sorted order', () => {
    const root = createBST();
    // Expected: 1, 2, 3, 4, 5, 6, 7
    expect(inorderTraversalIterative(root)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should handle a left-skewed tree', () => {
    const root = createLeftSkewedTree();
    // Expected: 3, 2, 1
    expect(inorderTraversalIterative(root)).toEqual([3, 2, 1]);
  });

  it('should handle a right-skewed tree', () => {
    const root = createRightSkewedTree();
    // Expected: 1, 2, 3
    expect(inorderTraversalIterative(root)).toEqual([1, 2, 3]);
  });

  it('should handle a tree with only left child', () => {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    expect(inorderTraversalIterative(root)).toEqual([2, 1]);
  });

  it('should handle a tree with only right child', () => {
    const root = new TreeNode(1);
    root.right = new TreeNode(2);
    expect(inorderTraversalIterative(root)).toEqual([1, 2]);
  });

  it('should work with string values', () => {
    const root = new TreeNode('B');
    root.left = new TreeNode('A');
    root.right = new TreeNode('C');
    expect(inorderTraversalIterative(root)).toEqual(['A', 'B', 'C']);
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

    // Expected: 1, 3, 5, 7, 9, 10, 12, 15, 20
    expect(inorderTraversalIterative(root)).toEqual([
      1, 3, 5, 7, 9, 10, 12, 15, 20,
    ]);
  });
});

describe('Recursive vs Iterative Implementation', () => {
  it('should produce identical results for the same tree', () => {
    const root = createTree();

    const recursiveResult = inorderTraversal(root);
    const iterativeResult = inorderTraversalIterative(root);

    expect(recursiveResult).toEqual(iterativeResult);
  });

  it('should produce identical results for a BST', () => {
    const root = createBST();

    const recursiveResult = inorderTraversal(root);
    const iterativeResult = inorderTraversalIterative(root);

    expect(recursiveResult).toEqual(iterativeResult);
  });

  it('should produce identical results for edge cases', () => {
    expect(inorderTraversal(null)).toEqual(inorderTraversalIterative(null));

    const single = new TreeNode(1);

    expect(inorderTraversal(single)).toEqual(inorderTraversalIterative(single));
  });
});
