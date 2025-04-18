import { beforeEach, describe, expect, it } from 'vitest';
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

  it('preorderTraversal should correctly perform pre-order traversal', () => {
    [10, 5, 15, 3, 7, 12, 18].forEach((num) => bst.insert(num));

    expect(bst.preorderTraversal()).toEqual([10, 5, 3, 7, 15, 12, 18]);
  });

  it('inorderTraversal should perform in-order traversal correctly', () => {
    [10, 5, 15, 3, 7, 12, 18].forEach((num) => bst.insert(num));

    expect(bst.inorderTraversal()).toEqual([3, 5, 7, 10, 12, 15, 18]);
  });

  it('postorderTraversal should perform post-order traversal correctly', () => {
    [10, 5, 15, 3, 7, 12, 18].forEach((num) => bst.insert(num));

    expect(bst.postorderTraversal()).toEqual([3, 7, 5, 12, 18, 15, 10]);
  });

  it('levelorderTraversal (iterative) should return an empty array for an empty tree', () => {
    expect(bst.levelorderTraversal()).toEqual([]);
  });

  it('levelorderTraversal (iterative) should return the root value in a single array for a tree with only a root', () => {
    bst.insert(5);

    expect(bst.levelorderTraversal()).toEqual([[5]]);
  });

  it('levelorderTraversal (iterative) should perform level order traversal correctly for a simple tree', () => {
    bst.insert(5);
    bst.insert(3);
    bst.insert(7);

    expect(bst.levelorderTraversal()).toEqual([[5], [3, 7]]);
  });

  it('levelorderTraversal (iterative) should perform levelorder traversal correctly for a more complex tree', () => {
    bst.insert(8);
    bst.insert(3);
    bst.insert(10);
    bst.insert(1);
    bst.insert(6);
    bst.insert(14);
    bst.insert(4);
    bst.insert(7);
    bst.insert(13);

    expect(bst.levelorderTraversal()).toEqual([
      [8],
      [3, 10],
      [1, 6, 14],
      [4, 7, 13],
    ]);
  });

  it('levelorderTraversal (iterative) should handle trees with only left children correctly', () => {
    bst.insert(5);
    bst.insert(3);
    bst.insert(2);
    bst.insert(1);

    expect(bst.levelorderTraversal()).toEqual([[5], [3], [2], [1]]);
  });

  it('levelorderTraversal (iterative) should handle trees with only right children correctly', () => {
    bst.insert(5);
    bst.insert(7);
    bst.insert(8);
    bst.insert(9);

    expect(bst.levelorderTraversal()).toEqual([[5], [7], [8], [9]]);
  });

  it('levelorderTraversal (iterative) should work with different strings', () => {
    const bst = new BST<string>();

    bst.insert('c');
    bst.insert('a');
    bst.insert('e');

    expect(bst.levelorderTraversal()).toEqual([['c'], ['a', 'e']]);
  });

  it('minValue should return null for an empty tree when finding the minimum value', () => {
    expect(bst.minValue()).toBeNull();
  });

  it('minValue should return the minimum value in the tree', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    expect(bst.minValue()).toBe(5);
  });

  it('maxValue should return null for an empty tree when finding the maximum value', () => {
    expect(bst.maxValue()).toBeNull();
  });

  it('maxValue should return the maximum value in the tree', () => {
    bst.insert(10);
    bst.insert(5);
    bst.insert(15);

    expect(bst.maxValue()).toBe(15);
  });

  it('should handle an empty tree', () => {
    const foundNode = bst.search(10);

    expect(foundNode).toBeNull();
    expect(bst.minValue()).toBeNull();
    expect(bst.maxValue()).toBeNull();
  });

  it('should handle a single node tree', () => {
    bst.insert(10);

    const foundNode = bst.search(10);

    expect(foundNode?.value).toBe(10);
    expect(bst.minValue()).toBe(10);
    expect(bst.maxValue()).toBe(10);
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
