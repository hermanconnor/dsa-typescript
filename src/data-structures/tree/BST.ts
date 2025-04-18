import TreeNode from './TreeNode';
import Queue from '../queue/Queue';

class BST<T> {
  root: TreeNode<T> | null;

  constructor() {
    this.root = null;
  }

  insert(value: T): void {
    const newNode = new TreeNode(value);

    if (!this.root) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  private insertNode(node: TreeNode<T>, newNode: TreeNode<T>): void {
    if (newNode.value < node.value) {
      if (!node.left) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (!node.right) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  search(value: T): TreeNode<T> | null {
    return this.searchNode(this.root, value);
  }

  private searchNode(root: TreeNode<T> | null, value: T): TreeNode<T> | null {
    let current = root;

    while (current) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        return current;
      }
    }

    return null;
  }

  preorderTraversal(): T[] {
    const result: T[] = [];
    this._preorderTraversal(this.root, result);
    return result;
  }

  private _preorderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (!node) return;

    // Visit root node
    result.push(node.value);

    // Visit left subtree
    this._preorderTraversal(node.left, result);

    // Visit right subtree
    this._preorderTraversal(node.right, result);
  }

  inorderTraversal(): T[] {
    const result: T[] = [];
    this._inorderTraversal(this.root, result);
    return result;
  }

  private _inorderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (!node) return;

    // Visit left subtree
    this._inorderTraversal(node.left, result);

    // Visit root node
    result.push(node.value);

    // Visit right subtree
    this._inorderTraversal(node.right, result);
  }

  postorderTraversal(): T[] {
    const result: T[] = [];
    this._postorderTraversal(this.root, result);
    return result;
  }

  private _postorderTraversal(node: TreeNode<T> | null, result: T[]): void {
    if (!node) return;

    // Visit left subtree
    this._postorderTraversal(node.left, result);

    // Visit right subtree
    this._postorderTraversal(node.right, result);

    // Visit root node
    result.push(node.value);
  }

  levelorderTraversal(): T[][] {
    const result: T[][] = [];

    if (!this.root) return result;

    const queue = new Queue<TreeNode<T>>();
    queue.enqueue(this.root);

    while (!queue.isEmpty()) {
      const levelSize = queue.size();
      const currentLevel: T[] = [];

      for (let i = 0; i < levelSize; i++) {
        const node = queue.dequeue();

        if (node) {
          currentLevel.push(node.value);

          if (node.left) {
            queue.enqueue(node.left);
          }

          if (node.right) {
            queue.enqueue(node.right);
          }
        }
      }

      result.push(currentLevel);
    }

    return result;
  }

  minValue(): T | null {
    if (!this.root) return null;

    let current = this.root;

    while (current.left) {
      current = current.left;
    }

    return current.value;
  }

  maxValue(): T | null {
    if (!this.root) return null;

    let current = this.root;

    while (current.right) {
      current = current.right;
    }

    return current.value;
  }

  delete(value: T): void {
    this.root = this.deleteNode(this.root, value);
  }

  private deleteNode(node: TreeNode<T> | null, value: T): TreeNode<T> | null {
    if (!node) return null;

    if (value < node.value) {
      node.left = this.deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = this.deleteNode(node.right, value);
    } else {
      // Case 1: Node has no children (leaf node)
      if (!node.left && !node.right) return null;

      // Case 2: Node has one child
      if (!node.left) {
        return node.right;
      } else if (!node.right) {
        return node.left;
      }

      // Case 3: Node has two children
      // Find the in-order successor (smallest node in the right subtree)
      const minNode = this.findMinNode(node.right);

      // Replace the value of the node with the in-order successor's value
      node.value = minNode.value;

      // Delete the in-order successor
      node.right = this.deleteNode(node.right, minNode.value);
    }

    return node;
  }

  private findMinNode(node: TreeNode<T> | null): TreeNode<T> {
    let current = node;

    while (current && current.left) {
      current = current.left;
    }

    return current!;
  }
}

export default BST;
