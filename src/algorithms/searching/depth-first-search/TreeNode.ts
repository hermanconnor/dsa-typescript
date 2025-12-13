/**
 * @class TreeNode
 * @template T The type of the value stored in the node.
 * @classdesc Represents a node in a binary tree.
 *
 * @property {T} value The data stored in the node.
 * @property {TreeNode<T> | null} left The left child node.
 * @property {TreeNode<T> | null} right The right child node.
 */
export class TreeNode<T> {
  // The data value held by the node.
  value: T;
  // Reference to the left child (null if no left child).
  left: TreeNode<T> | null;
  // Reference to the right child (null if no right child).
  right: TreeNode<T> | null;

  /**
   * Creates an instance of TreeNode.
   * @param {T} value - The value to store in the node.
   * @param {TreeNode<T> | null} [left=null] - The optional left child node.
   * @param {TreeNode<T> | null} [right=null] - The optional right child node.
   */
  constructor(
    value: T,
    left: TreeNode<T> | null = null,
    right: TreeNode<T> | null = null,
  ) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}
