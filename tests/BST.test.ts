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
});
