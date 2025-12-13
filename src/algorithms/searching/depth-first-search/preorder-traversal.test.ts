import { describe, it, expect } from 'vitest';
import { preorderTraversal } from './preorder-traversal';
import { TreeNode } from './TreeNode';

describe('preorderTraversal', () => {
  it('should return empty array for null node', () => {
    expect(preorderTraversal(null)).toEqual([]);
  });

  it('should return single value for single node tree', () => {
    const root = new TreeNode(5);
    expect(preorderTraversal(root)).toEqual([5]);
  });

  it('should traverse left-skewed tree correctly', () => {
    // Tree:     1
    //          /
    //         2
    //        /
    //       3
    const root = new TreeNode(1, new TreeNode(2, new TreeNode(3)));
    expect(preorderTraversal(root)).toEqual([1, 2, 3]);
  });

  it('should traverse right-skewed tree correctly', () => {
    // Tree: 1
    //        \
    //         2
    //          \
    //           3
    const root = new TreeNode(1, null, new TreeNode(2, null, new TreeNode(3)));
    expect(preorderTraversal(root)).toEqual([1, 2, 3]);
  });

  it('should traverse balanced tree correctly', () => {
    // Tree:     1
    //          / \
    //         2   3
    //        / \
    //       4   5
    const root = new TreeNode(
      1,
      new TreeNode(2, new TreeNode(4), new TreeNode(5)),
      new TreeNode(3),
    );
    expect(preorderTraversal(root)).toEqual([1, 2, 4, 5, 3]);
  });

  it('should traverse complex tree correctly', () => {
    // Tree:       1
    //          /     \
    //         2       3
    //        / \     / \
    //       4   5   6   7
    const root = new TreeNode(
      1,
      new TreeNode(2, new TreeNode(4), new TreeNode(5)),
      new TreeNode(3, new TreeNode(6), new TreeNode(7)),
    );
    expect(preorderTraversal(root)).toEqual([1, 2, 4, 5, 3, 6, 7]);
  });

  it('should handle tree with only left child', () => {
    // Tree:   1
    //        /
    //       2
    const root = new TreeNode(1, new TreeNode(2));
    expect(preorderTraversal(root)).toEqual([1, 2]);
  });

  it('should handle tree with only right child', () => {
    // Tree: 1
    //        \
    //         2
    const root = new TreeNode(1, null, new TreeNode(2));
    expect(preorderTraversal(root)).toEqual([1, 2]);
  });

  it('should work with different data types - strings', () => {
    // Tree:     'A'
    //          /   \
    //        'B'   'C'
    const root = new TreeNode('A', new TreeNode('B'), new TreeNode('C'));
    expect(preorderTraversal(root)).toEqual(['A', 'B', 'C']);
  });

  it('should work with different data types - objects', () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 2 };
    const obj3 = { id: 3 };
    const root = new TreeNode(obj1, new TreeNode(obj2), new TreeNode(obj3));
    expect(preorderTraversal(root)).toEqual([obj1, obj2, obj3]);
  });

  it('should handle deep tree without stack overflow', () => {
    // Create a deep left-skewed tree
    const root = new TreeNode(0);
    let current = root;
    for (let i = 1; i < 1000; i++) {
      current.left = new TreeNode(i);
      current = current.left;
    }

    const result = preorderTraversal(root);
    expect(result.length).toBe(1000);
    expect(result[0]).toBe(0);
    expect(result[999]).toBe(999);
  });

  it('should maintain correct order with negative numbers', () => {
    // Tree:     0
    //          / \
    //        -1   1
    const root = new TreeNode(0, new TreeNode(-1), new TreeNode(1));
    expect(preorderTraversal(root)).toEqual([0, -1, 1]);
  });
});
