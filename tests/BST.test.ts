import { beforeEach, describe, expect, it, vi } from 'vitest';
import BST from '../src/data-structures/tree/BST';

describe('Binary Search Tree', () => {
  let bst: BST<number>;

  beforeEach(() => {
    bst = new BST();
  });

  it('insert should correctly insert values', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    expect(bst.root?.value).toBe(10);
    expect(bst.root?.left?.value).toBe(5);
    expect(bst.root?.right?.value).toBe(15);
  });

  it('insert should not allow duplicate values', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);
    bst.insert(5); // duplicate

    // The tree should still have only one 5
    expect(bst.root?.left?.value).toBe(5);
    expect(bst.root?.right?.value).toBe(15);
  });

  it('search should return null if the value is not found', () => {
    bst.insert(10);

    const foundNode = bst.search(20);

    expect(foundNode).toBeNull();
  });

  it('search should find an existing node', () => {
    bst.insert(10);
    bst.insert(5);

    const foundNode = bst.search(5);

    expect(foundNode?.value).toBe(5);
  });

  it('search should find the root node', () => {
    bst.insert(10);

    const foundNode = bst.search(10);

    expect(foundNode?.value).toBe(10);
  });

  it('preOrderTraversal should correctly perform pre-order traversal', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    bst.preOrderTraversal(bst.root);

    expect(logSpy).toHaveBeenCalledWith(10);
    expect(logSpy).toHaveBeenCalledWith(5);
    expect(logSpy).toHaveBeenCalledWith(15);

    logSpy.mockRestore();
  });

  it('inOrderTraversal should perform in-order traversal correctly', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    bst.inOrderTraversal(bst.root);

    expect(logSpy).toHaveBeenCalledWith(5);
    expect(logSpy).toHaveBeenCalledWith(10);
    expect(logSpy).toHaveBeenCalledWith(15);

    logSpy.mockRestore();
  });

  it('postOrderTraversal should perform post-order traversal correctly', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    bst.postOrderTraversal(bst.root);

    expect(logSpy).toHaveBeenCalledWith(5);
    expect(logSpy).toHaveBeenCalledWith(15);
    expect(logSpy).toHaveBeenCalledWith(10);

    logSpy.mockRestore();
  });

  it('should return an empty array for an empty tree', () => {
    expect(bst.levelOrderTraversal(bst.root)).toEqual([]);
  });

  it('should return the root value in a single array for a tree with only a root', () => {
    bst.insert(5);

    expect(bst.levelOrderTraversal(bst.root)).toEqual([[5]]);
  });

  it('should perform level order traversal correctly for a simple tree', () => {
    bst.insert(5);
    bst.insert(3);
    bst.insert(7);

    expect(bst.levelOrderTraversal(bst.root)).toEqual([[5], [3, 7]]);
  });

  it('should perform level order traversal correctly for a more complex tree', () => {
    bst.insert(8);
    bst.insert(3);
    bst.insert(10);
    bst.insert(1);
    bst.insert(6);
    bst.insert(14);
    bst.insert(4);
    bst.insert(7);
    bst.insert(13);

    expect(bst.levelOrderTraversal(bst.root)).toEqual([
      [8],
      [3, 10],
      [1, 6, 14],
      [4, 7, 13],
    ]);
  });

  it('should handle trees with only left children correctly', () => {
    bst.insert(5);
    bst.insert(3);
    bst.insert(2);
    bst.insert(1);

    expect(bst.levelOrderTraversal(bst.root)).toEqual([[5], [3], [2], [1]]);
  });

  it('should handle trees with only right children correctly', () => {
    bst.insert(5);
    bst.insert(7);
    bst.insert(8);
    bst.insert(9);

    expect(bst.levelOrderTraversal(bst.root)).toEqual([[5], [7], [8], [9]]);
  });

  it('should work with different strings', () => {
    const bst = new BST<string>();

    bst.insert('c');
    bst.insert('a');
    bst.insert('e');

    expect(bst.levelOrderTraversal(bst.root)).toEqual([['c'], ['a', 'e']]);
  });

  it('findMinValue should return null for an empty tree when finding the minimum value', () => {
    expect(bst.findMinValue()).toBeNull();
  });

  it('findMinValue should return the minimum value in the tree', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    expect(bst.findMinValue()).toBe(5);
  });

  it('findMaxValue should return null for an empty tree when finding the maximum value', () => {
    expect(bst.findMaxValue()).toBeNull();
  });

  it('findMaxValue should return the maximum value in the tree', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    expect(bst.findMaxValue()).toBe(15);
  });

  it('should handle an empty tree', () => {
    const foundNode = bst.search(10);

    expect(foundNode).toBeNull();
    expect(bst.findMinValue()).toBeNull();
    expect(bst.findMaxValue()).toBeNull();
  });

  it('should handle a single node tree', () => {
    bst.insert(10);

    const foundNode = bst.search(10);

    expect(foundNode?.value).toBe(10);
    expect(bst.findMinValue()).toBe(10);
    expect(bst.findMaxValue()).toBe(10);
  });

  it('should handle an unbalanced tree (insert in ascending order)', () => {
    bst.insert(1);
    bst.insert(2);
    bst.insert(3);
    bst.insert(4);

    expect(bst.root?.value).toBe(1);
    expect(bst.root?.right?.value).toBe(2);
    expect(bst.root?.right?.right?.value).toBe(3);
    expect(bst.root?.right?.right?.right?.value).toBe(4);
  });

  it('delete should handle deletion from an empty tree', () => {
    bst.delete(10);

    expect(bst.root).toBeNull();
  });

  it('delete should do nothing if node does not exist', () => {
    bst.insert(10);

    bst.delete(15);
    const foundNode = bst.search(10);

    expect(foundNode?.value).toBe(10); // root should still exist
    expect(bst.search(15)).toBeNull(); // 15 does not exist
  });

  it('delete should delete a leaf node', () => {
    bst.insert(10);
    bst.insert(5);

    bst.delete(5);

    expect(bst.search(5)).toBeNull(); // should no longer exist
    expect(bst.root?.left).toBeNull(); // left child should be null
  });

  it('delete should delete a node with one child', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(3);

    bst.delete(5);

    expect(bst.search(5)).toBeNull(); // should no longer exist
    expect(bst.root?.left?.value).toBe(3); // child should take the place of deleted node
  });

  it('delete should delete a node with two children', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);
    bst.insert(3);
    bst.insert(7);
    bst.insert(12);
    bst.insert(17);

    bst.delete(5);

    expect(bst.search(5)).toBeNull(); // should no longer exist
    expect(bst.search(7)?.value).toBe(7); // in-order successor should take the place
  });

  it('delete should delete the root node with no children', () => {
    bst.insert(10);

    bst.delete(10);

    expect(bst.root).toBeNull();
  });

  it('delete should delete the root node with one child', () => {
    bst.insert(10);
    bst.insert(5);

    bst.delete(10);

    expect(bst.root?.value).toBe(5); // root should now be the child
  });

  it('delete should delete the root node with two children', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);
    bst.insert(3);
    bst.insert(7);

    bst.delete(10);

    expect(bst.root?.value).toBe(15); // in-order successor should become the root
  });

  it('delete should delete all nodes and result in an empty tree', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    bst.delete(10);
    bst.delete(5);
    bst.delete(15);

    expect(bst.root).toBeNull();
  });
});
