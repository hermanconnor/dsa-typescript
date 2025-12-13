import { describe, it, expect } from 'vitest';
import { levelOrder, levelOrderArray, TreeNode } from './level-order-traversal';

describe('Level Order Traversal', () => {
  it('should return empty array for null root', () => {
    expect(levelOrder(null)).toEqual([]);
    expect(levelOrderArray(null)).toEqual([]);
  });

  it('should handle single node tree', () => {
    const root = new TreeNode(1);
    expect(levelOrder(root)).toEqual([[1]]);
    expect(levelOrderArray(root)).toEqual([[1]]);
  });

  it('should traverse complete binary tree', () => {
    //       3
    //      / \
    //     9  20
    //       /  \
    //      15   7
    const root = new TreeNode(3);
    root.left = new TreeNode(9);
    root.right = new TreeNode(20);
    root.right.left = new TreeNode(15);
    root.right.right = new TreeNode(7);

    expect(levelOrder(root)).toEqual([[3], [9, 20], [15, 7]]);
    expect(levelOrderArray(root)).toEqual([[3], [9, 20], [15, 7]]);
  });

  it('should handle left-skewed tree', () => {
    //     1
    //    /
    //   2
    //  /
    // 3
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.left.left = new TreeNode(3);

    expect(levelOrder(root)).toEqual([[1], [2], [3]]);
    expect(levelOrderArray(root)).toEqual([[1], [2], [3]]);
  });

  it('should handle right-skewed tree', () => {
    // 1
    //  \
    //   2
    //    \
    //     3
    const root = new TreeNode(1);
    root.right = new TreeNode(2);
    root.right.right = new TreeNode(3);

    expect(levelOrder(root)).toEqual([[1], [2], [3]]);
    expect(levelOrderArray(root)).toEqual([[1], [2], [3]]);
  });

  it('should handle larger balanced tree', () => {
    //         1
    //       /   \
    //      2     3
    //     / \   / \
    //    4   5 6   7
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.left = new TreeNode(6);
    root.right.right = new TreeNode(7);

    expect(levelOrder(root)).toEqual([[1], [2, 3], [4, 5, 6, 7]]);
    expect(levelOrderArray(root)).toEqual([[1], [2, 3], [4, 5, 6, 7]]);
  });

  it('should handle unbalanced tree with gaps', () => {
    //       1
    //      / \
    //     2   3
    //    /     \
    //   4       5
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.right.right = new TreeNode(5);

    expect(levelOrder(root)).toEqual([[1], [2, 3], [4, 5]]);
    expect(levelOrderArray(root)).toEqual([[1], [2, 3], [4, 5]]);
  });

  it('should handle negative values', () => {
    const root = new TreeNode(-10);
    root.left = new TreeNode(-5);
    root.right = new TreeNode(20);

    expect(levelOrder(root)).toEqual([[-10], [-5, 20]]);
    expect(levelOrderArray(root)).toEqual([[-10], [-5, 20]]);
  });
});
