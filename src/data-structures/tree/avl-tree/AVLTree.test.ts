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
      expect(tree.search(10)).toBe(true);
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

  describe('search', () => {
    beforeEach(() => {
      [10, 5, 15, 3, 7, 12, 20].forEach((val) => tree.insert(val));
    });

    it('should find existing values', () => {
      expect(tree.search(10)).toBe(true);
      expect(tree.search(3)).toBe(true);
      expect(tree.search(20)).toBe(true);
    });

    it('should not find non-existing values', () => {
      expect(tree.search(1)).toBe(false);
      expect(tree.search(100)).toBe(false);
      expect(tree.search(8)).toBe(false);
    });

    it('should return false for empty tree', () => {
      const emptyTree = new AVLTree<number>();

      expect(emptyTree.search(10)).toBe(false);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      [10, 5, 15, 3, 7, 12, 20].forEach((val) => tree.insert(val));
    });

    it('should delete leaf nodes', () => {
      tree.delete(3);

      expect(tree.search(3)).toBe(false);
      expect(tree.inOrder()).toEqual([5, 7, 10, 12, 15, 20]);
    });

    it('should delete node with one child', () => {
      tree.delete(5);

      expect(tree.search(5)).toBe(false);
      expect(tree.isBalanced()).toBe(true);
    });

    it('should delete node with two children', () => {
      tree.delete(15);

      expect(tree.search(15)).toBe(false);
      expect(tree.isBalanced()).toBe(true);
    });

    it('should delete root node', () => {
      tree.delete(10);

      expect(tree.search(10)).toBe(false);
      expect(tree.isBalanced()).toBe(true);
    });

    it('should maintain balance after deletions', () => {
      tree.delete(3);
      tree.delete(7);
      tree.delete(12);

      expect(tree.isBalanced()).toBe(true);
    });

    it('should handle deleting non-existent values', () => {
      const initialOrder = tree.inOrder();

      tree.delete(100);

      expect(tree.inOrder()).toEqual(initialOrder);
    });

    it('should handle deleting all values', () => {
      [10, 5, 15, 3, 7, 12, 20].forEach((val) => tree.delete(val));

      expect(tree.isEmpty()).toBe(true);
      expect(tree.inOrder()).toEqual([]);
    });
  });

  describe('height', () => {
    it('should return 0 for empty tree', () => {
      expect(tree.getTreeHeight()).toBe(0);
    });

    it('should return 1 for single node', () => {
      tree.insert(10);

      expect(tree.getTreeHeight()).toBe(1);
    });

    it('should calculate correct height for balanced tree', () => {
      [10, 5, 15, 3, 7, 12, 20].forEach((val) => tree.insert(val));

      expect(tree.getTreeHeight()).toBe(3);
    });

    it('should maintain logarithmic height', () => {
      // Insert 15 values - height should be ~4 (log2(15) ≈ 3.9)
      for (let i = 1; i <= 15; i++) {
        tree.insert(i);
      }

      expect(tree.getTreeHeight()).toBeLessThanOrEqual(5);
    });
  });

  describe('custom comparator', () => {
    interface Person {
      name: string;
      age: number;
    }

    it('should work with custom objects', () => {
      const personTree = new AVLTree<Person>((a, b) => a.age - b.age);

      personTree.insert({ name: 'Alice', age: 30 });
      personTree.insert({ name: 'Bob', age: 25 });
      personTree.insert({ name: 'Charlie', age: 35 });

      const sorted = personTree.inOrder();

      expect(sorted.map((p) => p.age)).toEqual([25, 30, 35]);
    });

    it('should work with reverse order', () => {
      const reverseTree = new AVLTree<number>((a, b) => b - a);

      [5, 3, 7, 1, 9].forEach((val) => reverseTree.insert(val));

      expect(reverseTree.inOrder()).toEqual([9, 7, 5, 3, 1]);
    });
  });
});
