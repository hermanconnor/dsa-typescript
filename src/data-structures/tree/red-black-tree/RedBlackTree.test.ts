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

  describe('Validation', () => {
    it('should validate empty tree', () => {
      const tree = new RedBlackTree<number>();

      expect(tree.isValid()).toBe(true);
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
