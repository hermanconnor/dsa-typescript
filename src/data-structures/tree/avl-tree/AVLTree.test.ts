import { describe, it, expect, beforeEach } from 'vitest';
import AVLTree from './AVLTree';

describe('AVLTree', () => {
  let tree: AVLTree<number>;

  beforeEach(() => {
    tree = new AVLTree<number>();
  });

  describe('initialization', () => {
    it('should create an empty tree', () => {
      expect(tree.isEmpty()).toBe(true);
      expect(tree.getTreeHeight()).toBe(0);
      expect(tree.inOrder()).toEqual([]);
    });
  });

  describe('insert', () => {
    it('should insert a single value', () => {
      tree.insert(10);

      expect(tree.isEmpty()).toBe(false);
      expect(tree.inOrder()).toEqual([10]);
    });

    it('should insert multiple values in order', () => {
      [5, 3, 7, 1, 9].forEach((val) => tree.insert(val));

      expect(tree.inOrder()).toEqual([1, 3, 5, 7, 9]);
    });

    it('should handle duplicate insertions', () => {
      tree.insert(10);
      tree.insert(10);

      expect(tree.inOrder()).toEqual([10]);
    });

    it('should maintain balance after insertions', () => {
      // Insert values that would create imbalance in regular BST
      [1, 2, 3, 4, 5, 6, 7].forEach((val) => tree.insert(val));

      expect(tree.isBalanced()).toBe(true);
    });

    it('should handle right-right case (left rotation)', () => {
      tree.insert(10);
      tree.insert(20);
      tree.insert(30);

      expect(tree.isBalanced()).toBe(true);
      expect(tree.inOrder()).toEqual([10, 20, 30]);
    });

    it('should handle left-left case (right rotation)', () => {
      tree.insert(30);
      tree.insert(20);
      tree.insert(10);

      expect(tree.isBalanced()).toBe(true);
      expect(tree.inOrder()).toEqual([10, 20, 30]);
    });

    it('should handle left-right case', () => {
      tree.insert(30);
      tree.insert(10);
      tree.insert(20);

      expect(tree.isBalanced()).toBe(true);
      expect(tree.inOrder()).toEqual([10, 20, 30]);
    });

    it('should handle right-left case', () => {
      tree.insert(10);
      tree.insert(30);
      tree.insert(20);

      expect(tree.isBalanced()).toBe(true);
      expect(tree.inOrder()).toEqual([10, 20, 30]);
    });
  });
});
