import TreeNode from './TreeNode';

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

  preOrderTraversal(node: TreeNode<T> | null): void {
    if (!node) return;

    // Visit root node
    console.log(node.value); // Or do something with the value

    // Visit left subtree
    this.preOrderTraversal(node.left);

    // Visit right subtree
    this.preOrderTraversal(node.right);
  }

  inOrderTraversal(node: TreeNode<T> | null): void {
    if (!node) return;

    // Visit left subtree
    this.inOrderTraversal(node.left);

    // Visit root node
    console.log(node.value);

    // Visit right subtree
    this.inOrderTraversal(node.right);
  }

  postOrderTraversal(node: TreeNode<T> | null): void {
    if (!node) return;

    // Visit left subtree
    this.postOrderTraversal(node.left);

    // Visit right subtree
    this.postOrderTraversal(node.right);

    // Visit root node
    console.log(node.value);
  }

  findMinValue(): T | null {
    if (!this.root) return null;

    let current = this.root;

    while (current.left) {
      current = current.left;
    }

    return current.value;
  }

  findMaxValue(): T | null {
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
      const minNode = this.findMinNodeInSubtree(node.right);

      // Replace the value of the node with the in-order successor's value
      node.value = minNode.value;

      // Delete the in-order successor
      node.right = this.deleteNode(node.right, minNode.value);
    }

    return node;
  }

  private findMinNodeInSubtree(node: TreeNode<T> | null): TreeNode<T> {
    let current = node;

    while (current && current.left) {
      current = current.left;
    }

    return current!;
  }
}

export default BST;
