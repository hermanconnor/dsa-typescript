import { describe, it, expect, beforeEach } from 'vitest';
import RedBlackTree from './RedBlackTree';

describe('RedBlackTree', () => {
  describe('Constructor', () => {
    it('should create an empty tree', () => {
      const tree = new RedBlackTree<number>();

      expect(tree.search(1)).toBe(false);
      expect(tree.getHeight()).toBe(0);
      expect(tree.isValid()).toBe(true);
    });

    it('should accept a custom comparison function', () => {
      const tree = new RedBlackTree<{ id: number; name: string }>(
        (a, b) => a.id - b.id,
      );

      tree.insert({ id: 5, name: 'Alice' });
      tree.insert({ id: 3, name: 'Bob' });

      expect(tree.search({ id: 5, name: 'Alice' })).toBe(true);
      expect(tree.search({ id: 3, name: 'Bob' })).toBe(true);
    });
  });

  describe('Insert', () => {
    let tree: RedBlackTree<number>;

    beforeEach(() => {
      tree = new RedBlackTree<number>();
    });

    it('should insert a single element', () => {
      tree.insert(5);

      expect(tree.search(5)).toBe(true);
      expect(tree.isValid()).toBe(true);
    });

    it('should insert multiple elements', () => {
      const values = [10, 5, 15, 3, 7, 12, 17];
      values.forEach((v) => tree.insert(v));

      values.forEach((v) => {
        expect(tree.search(v)).toBe(true);
      });
      expect(tree.isValid()).toBe(true);
    });

    it('should not insert duplicates', () => {
      tree.insert(5);
      tree.insert(5);
      tree.insert(5);

      const values: number[] = [];
      tree.inOrder((v) => values.push(v));
      expect(values).toEqual([5]);
    });

    it('should maintain Red-Black properties after insertions', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      values.forEach((v) => tree.insert(v));

      expect(tree.isValid()).toBe(true);
    });

    it('should handle reverse-sorted insertions', () => {
      const values = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

      values.forEach((v) => tree.insert(v));

      expect(tree.isValid()).toBe(true);
    });

    it('should handle random insertions', () => {
      const values = [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13];

      values.forEach((v) => tree.insert(v));

      expect(tree.isValid()).toBe(true);

      values.forEach((v) => {
        expect(tree.search(v)).toBe(true);
      });
    });

    it('should work with string values', () => {
      const strTree = new RedBlackTree<string>();
      const values = ['dog', 'cat', 'bird', 'fish', 'hamster'];
      values.forEach((v) => strTree.insert(v));

      expect(strTree.isValid()).toBe(true);
      values.forEach((v) => {
        expect(strTree.search(v)).toBe(true);
      });
    });
  });

  describe('Search', () => {
    let tree: RedBlackTree<number>;

    beforeEach(() => {
      tree = new RedBlackTree<number>();
      [10, 5, 15, 3, 7, 12, 17].forEach((v) => tree.insert(v));
    });

    it('should find existing values', () => {
      expect(tree.search(10)).toBe(true);
      expect(tree.search(5)).toBe(true);
      expect(tree.search(15)).toBe(true);
    });

    it('should not find non-existing values', () => {
      expect(tree.search(1)).toBe(false);
      expect(tree.search(100)).toBe(false);
      expect(tree.search(8)).toBe(false);
    });

    it('should return false for empty tree', () => {
      const emptyTree = new RedBlackTree<number>();

      expect(emptyTree.search(1)).toBe(false);
    });
  });

  describe('Delete', () => {
    let tree: RedBlackTree<number>;

    beforeEach(() => {
      tree = new RedBlackTree<number>();
    });

    it('should delete a leaf node', () => {
      [10, 5, 15].forEach((v) => tree.insert(v));

      tree.delete(5);

      expect(tree.search(5)).toBe(false);
      expect(tree.search(10)).toBe(true);
      expect(tree.search(15)).toBe(true);
      expect(tree.isValid()).toBe(true);
    });

    it('should delete a node with one child', () => {
      [10, 5, 15, 3].forEach((v) => tree.insert(v));

      tree.delete(5);

      expect(tree.search(5)).toBe(false);
      expect(tree.search(3)).toBe(true);
      expect(tree.isValid()).toBe(true);
    });

    it('should delete a node with two children', () => {
      [10, 5, 15, 3, 7, 12, 17].forEach((v) => tree.insert(v));

      tree.delete(10);

      expect(tree.search(10)).toBe(false);
      expect(tree.isValid()).toBe(true);
    });

    it('should delete the root node', () => {
      tree.insert(10);
      tree.delete(10);

      expect(tree.search(10)).toBe(false);
      expect(tree.getHeight()).toBe(0);
      expect(tree.isValid()).toBe(true);
    });

    it('should handle deleting non-existing values', () => {
      [10, 5, 15].forEach((v) => tree.insert(v));

      tree.delete(100);

      expect(tree.search(10)).toBe(true);
      expect(tree.search(5)).toBe(true);
      expect(tree.search(15)).toBe(true);
      expect(tree.isValid()).toBe(true);
    });

    it('should maintain Red-Black properties after multiple deletions', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      values.forEach((v) => tree.insert(v));

      [2, 4, 6, 8].forEach((v) => tree.delete(v));

      expect(tree.isValid()).toBe(true);
      [2, 4, 6, 8].forEach((v) => {
        expect(tree.search(v)).toBe(false);
      });
      [1, 3, 5, 7, 9, 10].forEach((v) => {
        expect(tree.search(v)).toBe(true);
      });
    });

    it('should handle deleting all nodes', () => {
      const values = [10, 5, 15, 3, 7, 12, 17];

      values.forEach((v) => tree.insert(v));
      values.forEach((v) => tree.delete(v));

      expect(tree.getHeight()).toBe(0);
      expect(tree.isValid()).toBe(true);
      values.forEach((v) => {
        expect(tree.search(v)).toBe(false);
      });
    });
  });

  describe('In-Order Traversal', () => {
    it('should return elements in sorted order', () => {
      const tree = new RedBlackTree<number>();

      const values = [7, 3, 18, 10, 22, 8, 11, 26];
      values.forEach((v) => tree.insert(v));

      const result: number[] = [];
      tree.inOrder((v) => result.push(v));

      expect(result).toEqual([3, 7, 8, 10, 11, 18, 22, 26]);
    });

    it('should work with empty tree', () => {
      const tree = new RedBlackTree<number>();
      const result: number[] = [];

      tree.inOrder((v) => result.push(v));

      expect(result).toEqual([]);
    });

    it('should work with single element', () => {
      const tree = new RedBlackTree<number>();

      tree.insert(42);
      const result: number[] = [];
      tree.inOrder((v) => result.push(v));

      expect(result).toEqual([42]);
    });
  });

  describe('Height', () => {
    it('should return 0 for empty tree', () => {
      const tree = new RedBlackTree<number>();

      expect(tree.getHeight()).toBe(0);
    });

    it('should return correct height for balanced insertions', () => {
      const tree = new RedBlackTree<number>();

      [10, 5, 15].forEach((v) => tree.insert(v));

      expect(tree.getHeight()).toBeGreaterThan(0);
      expect(tree.getHeight()).toBeLessThanOrEqual(3);
    });

    it('should maintain logarithmic height', () => {
      const tree = new RedBlackTree<number>();
      const n = 100;
      for (let i = 1; i <= n; i++) {
        tree.insert(i);
      }

      // Red-Black tree height should be at most 2*log2(n+1)
      const maxHeight = 2 * Math.log2(n + 1);
      expect(tree.getHeight()).toBeLessThanOrEqual(Math.ceil(maxHeight));
    });
  });

  describe('Black Height', () => {
    it('should return 1 for empty tree', () => {
      const tree = new RedBlackTree<number>();

      expect(tree.getBlackHeight()).toBe(1);
    });

    it('should return consistent black height', () => {
      const tree = new RedBlackTree<number>();
      const values = [10, 5, 15, 3, 7, 12, 17];
      values.forEach((v) => tree.insert(v));

      const blackHeight = tree.getBlackHeight();

      expect(blackHeight).toBeGreaterThan(0);
    });
  });

  describe('Validation', () => {
    it('should validate empty tree', () => {
      const tree = new RedBlackTree<number>();

      expect(tree.isValid()).toBe(true);
    });

    it('should validate tree after various operations', () => {
      const tree = new RedBlackTree<number>();

      // Insert phase
      for (let i = 1; i <= 50; i++) {
        tree.insert(i);
        expect(tree.isValid()).toBe(true);
      }

      // Delete phase
      for (let i = 1; i <= 25; i++) {
        tree.delete(i);
        expect(tree.isValid()).toBe(true);
      }
    });

    it('should validate with random operations', () => {
      const tree = new RedBlackTree<number>();
      const values = Array.from({ length: 30 }, () =>
        Math.floor(Math.random() * 100),
      );

      values.forEach((v) => {
        tree.insert(v);
        expect(tree.isValid()).toBe(true);
      });
    });
  });
});
