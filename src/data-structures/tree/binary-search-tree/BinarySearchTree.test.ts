import { describe, it, expect, beforeEach } from 'vitest';
import BinarySearchTree from './BinarySearchTree';

describe('BinarySearchTree', () => {
  describe('Constructor and Basic Operations', () => {
    it('should create an empty tree', () => {
      const bst = new BinarySearchTree<number>();

      expect(bst.isEmpty()).toBe(true);
      expect(bst.size()).toBe(0);
      expect(bst.getRoot()).toBe(null);
    });

    it('should use default comparison for numbers', () => {
      const bst = new BinarySearchTree<number>();

      bst.insert(5);
      bst.insert(3);
      bst.insert(7);

      expect(bst.inorder()).toEqual([3, 5, 7]);
    });

    it('should use localeCompare for strings', () => {
      const bst = new BinarySearchTree<string>();

      bst.insert('dog');
      bst.insert('cat');
      bst.insert('elephant');
      bst.insert('apple');

      expect(bst.inorder()).toEqual(['apple', 'cat', 'dog', 'elephant']);
    });

    it('should accept custom comparison function', () => {
      // Reverse order comparison
      const bst = new BinarySearchTree<number>((a, b) => b - a);

      bst.insert(5);
      bst.insert(3);
      bst.insert(7);

      expect(bst.inorder()).toEqual([7, 5, 3]);
    });
  });

  describe('Insert', () => {
    let bst: BinarySearchTree<number>;

    beforeEach(() => {
      bst = new BinarySearchTree<number>();
    });

    it('should insert values correctly', () => {
      bst.insert(50);
      bst.insert(30);
      bst.insert(70);
      bst.insert(20);
      bst.insert(40);
      bst.insert(60);
      bst.insert(80);

      expect(bst.size()).toBe(7);
      expect(bst.inorder()).toEqual([20, 30, 40, 50, 60, 70, 80]);
    });

    it('should not insert duplicate values', () => {
      bst.insert(50);
      bst.insert(30);
      bst.insert(50); // duplicate
      bst.insert(30); // duplicate

      expect(bst.size()).toBe(2);
      expect(bst.inorder()).toEqual([30, 50]);
    });

    it('should handle inserting into empty tree', () => {
      bst.insert(42);

      expect(bst.getRoot()?.val).toBe(42);
      expect(bst.size()).toBe(1);
    });
  });

  describe('Search and Find', () => {
    let bst: BinarySearchTree<number>;

    beforeEach(() => {
      bst = new BinarySearchTree<number>();
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
    });

    it('should find existing values', () => {
      expect(bst.search(50)).toBe(true);
      expect(bst.search(30)).toBe(true);
      expect(bst.search(80)).toBe(true);
    });

    it('should not find non-existing values', () => {
      expect(bst.search(100)).toBe(false);
      expect(bst.search(25)).toBe(false);
      expect(bst.search(0)).toBe(false);
    });

    it('should return null for search in empty tree', () => {
      const emptyBst = new BinarySearchTree<number>();

      expect(emptyBst.search(50)).toBe(false);
    });

    it('should find and return node', () => {
      const node = bst.find(30);

      expect(node).not.toBe(null);
      expect(node?.val).toBe(30);
      expect(node?.left?.val).toBe(20);
      expect(node?.right?.val).toBe(40);
    });

    it('should return null when finding non-existent value', () => {
      expect(bst.find(999)).toBe(null);
    });
  });

  describe('Min and Max', () => {
    let bst: BinarySearchTree<number>;

    beforeEach(() => {
      bst = new BinarySearchTree<number>();
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
    });

    it('should find minimum value', () => {
      expect(bst.findMin()).toBe(20);
    });

    it('should find maximum value', () => {
      expect(bst.findMax()).toBe(80);
    });

    it('should return null for min in empty tree', () => {
      const emptyBst = new BinarySearchTree<number>();
      expect(emptyBst.findMin()).toBe(null);
    });

    it('should return null for max in empty tree', () => {
      const emptyBst = new BinarySearchTree<number>();
      expect(emptyBst.findMax()).toBe(null);
    });

    it('should handle tree with single node', () => {
      const singleNode = new BinarySearchTree<number>();

      singleNode.insert(42);
      expect(singleNode.findMin()).toBe(42);
      expect(singleNode.findMax()).toBe(42);
    });
  });

  describe('Delete', () => {
    let bst: BinarySearchTree<number>;

    beforeEach(() => {
      bst = new BinarySearchTree<number>();
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
    });

    it('should delete leaf node', () => {
      expect(bst.delete(20)).toBe(true);
      expect(bst.search(20)).toBe(false);
      expect(bst.size()).toBe(6);
      expect(bst.inorder()).toEqual([30, 40, 50, 60, 70, 80]);
    });

    it('should delete node with one child', () => {
      bst.delete(20);
      bst.delete(40);
      // Now 30 has only one child path
      expect(bst.delete(30)).toBe(true);
      expect(bst.search(30)).toBe(false);
    });

    it('should delete node with two children', () => {
      expect(bst.delete(30)).toBe(true);
      expect(bst.search(30)).toBe(false);
      expect(bst.size()).toBe(6);
      // Replaced with inorder successor (40)
      expect(bst.inorder()).toEqual([20, 40, 50, 60, 70, 80]);
    });

    it('should delete root node', () => {
      expect(bst.delete(50)).toBe(true);
      expect(bst.search(50)).toBe(false);
      expect(bst.size()).toBe(6);
    });

    it('should return false when deleting non-existent value', () => {
      expect(bst.delete(999)).toBe(false);
      expect(bst.size()).toBe(7);
    });

    it('should handle deleting from single-node tree', () => {
      const singleNode = new BinarySearchTree<number>();

      singleNode.insert(42);

      expect(singleNode.delete(42)).toBe(true);
      expect(singleNode.isEmpty()).toBe(true);
    });

    it('should maintain BST property after deletion', () => {
      bst.delete(30);
      bst.delete(70);

      expect(bst.isValidBST()).toBe(true);
    });
  });

  describe('Traversals', () => {
    let bst: BinarySearchTree<number>;

    beforeEach(() => {
      bst = new BinarySearchTree<number>();
      //        50
      //       /  \
      //      30   70
      //     / \   / \
      //    20 40 60 80
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
    });

    it('should perform inorder traversal', () => {
      expect(bst.inorder()).toEqual([20, 30, 40, 50, 60, 70, 80]);
    });

    it('should perform preorder traversal', () => {
      expect(bst.preorder()).toEqual([50, 30, 20, 40, 70, 60, 80]);
    });

    it('should perform postorder traversal', () => {
      expect(bst.postorder()).toEqual([20, 40, 30, 60, 80, 70, 50]);
    });

    it('should perform level-order traversal', () => {
      const result = bst.levelOrder();

      expect(result).toEqual([[50], [30, 70], [20, 40, 60, 80]]);
    });

    it('should return empty array for traversals on empty tree', () => {
      const emptyBst = new BinarySearchTree<number>();

      expect(emptyBst.inorder()).toEqual([]);
      expect(emptyBst.preorder()).toEqual([]);
      expect(emptyBst.postorder()).toEqual([]);
      expect(emptyBst.levelOrder()).toEqual([]);
    });

    it('should handle single node traversal', () => {
      const singleNode = new BinarySearchTree<number>();

      singleNode.insert(42);

      expect(singleNode.inorder()).toEqual([42]);
      expect(singleNode.preorder()).toEqual([42]);
      expect(singleNode.postorder()).toEqual([42]);
      expect(singleNode.levelOrder()).toEqual([[42]]);
    });
  });

  describe('Tree Properties', () => {
    let bst: BinarySearchTree<number>;

    beforeEach(() => {
      bst = new BinarySearchTree<number>();
    });

    it('should calculate height correctly', () => {
      expect(bst.height()).toBe(-1); // empty tree

      bst.insert(50);
      expect(bst.height()).toBe(0); // single node

      bst.insert(30);
      bst.insert(70);
      expect(bst.height()).toBe(1);

      bst.insert(20);
      bst.insert(40);
      bst.insert(60);
      bst.insert(80);
      expect(bst.height()).toBe(2);
    });

    it('should calculate size correctly', () => {
      expect(bst.size()).toBe(0);

      bst.insert(50);
      expect(bst.size()).toBe(1);

      [30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
      expect(bst.size()).toBe(7);
    });

    it('should validate BST correctly', () => {
      bst.insert(50);
      bst.insert(30);
      bst.insert(70);

      expect(bst.isValidBST()).toBe(true);
    });

    it('should handle isEmpty correctly', () => {
      expect(bst.isEmpty()).toBe(true);

      bst.insert(50);

      expect(bst.isEmpty()).toBe(false);
    });
  });

  describe('Utility Methods', () => {
    let bst: BinarySearchTree<number>;

    beforeEach(() => {
      bst = new BinarySearchTree<number>();
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
    });

    it('should convert to array', () => {
      expect(bst.toArray()).toEqual([20, 30, 40, 50, 60, 70, 80]);
    });

    it('should clear the tree', () => {
      bst.clear();

      expect(bst.isEmpty()).toBe(true);
      expect(bst.size()).toBe(0);
      expect(bst.getRoot()).toBe(null);
    });

    it('should get root node', () => {
      const root = bst.getRoot();

      expect(root?.val).toBe(50);
    });
  });

  describe('Edge Cases', () => {
    it('should handle unbalanced tree (left skewed)', () => {
      const bst = new BinarySearchTree<number>();

      [5, 4, 3, 2, 1].forEach((val) => bst.insert(val));

      expect(bst.height()).toBe(4);
      expect(bst.inorder()).toEqual([1, 2, 3, 4, 5]);
      expect(bst.isValidBST()).toBe(true);
    });

    it('should handle unbalanced tree (right skewed)', () => {
      const bst = new BinarySearchTree<number>();

      [1, 2, 3, 4, 5].forEach((val) => bst.insert(val));

      expect(bst.height()).toBe(4);
      expect(bst.inorder()).toEqual([1, 2, 3, 4, 5]);
      expect(bst.isValidBST()).toBe(true);
    });

    it('should handle negative numbers', () => {
      const bst = new BinarySearchTree<number>();

      [0, -5, 5, -3, 3].forEach((val) => bst.insert(val));

      expect(bst.inorder()).toEqual([-5, -3, 0, 3, 5]);
      expect(bst.findMin()).toBe(-5);
      expect(bst.findMax()).toBe(5);
    });

    it('should handle floating point numbers', () => {
      const bst = new BinarySearchTree<number>();

      [3.5, 1.2, 5.7, 2.3, 4.1].forEach((val) => bst.insert(val));

      expect(bst.inorder()).toEqual([1.2, 2.3, 3.5, 4.1, 5.7]);
    });
  });

  describe('Complex Operations', () => {
    it('should handle multiple insertions and deletions', () => {
      const bst = new BinarySearchTree<number>();

      // Insert
      [50, 30, 70, 20, 40, 60, 80].forEach((val) => bst.insert(val));
      expect(bst.size()).toBe(7);

      // Delete some
      bst.delete(20);
      bst.delete(40);

      expect(bst.size()).toBe(5);

      // Insert more
      bst.insert(25);
      bst.insert(35);

      expect(bst.size()).toBe(7);

      // Verify sorted order
      expect(bst.inorder()).toEqual([25, 30, 35, 50, 60, 70, 80]);
      expect(bst.isValidBST()).toBe(true);
    });

    it('should maintain correct structure after operations', () => {
      const bst = new BinarySearchTree<number>();

      [50, 30, 70, 20, 40].forEach((val) => bst.insert(val));

      bst.delete(30);

      const root = bst.getRoot();

      expect(root?.val).toBe(50);
      expect(root?.left?.val).toBe(40);
      expect(root?.left?.left?.val).toBe(20);
    });
  });
});
