# What is a Binary Search Tree?

A binary tree is a data structure where each node can have a maximum of two child nodes, called the left child and the right child, essentially creating a hierarchical structure where each node can branch out to at most two other nodes; it's a type of tree data structure with a limit of two children per node

A **binary search tree** (BST) is a data structure that is organized in a way that allows for efficient searching, insertion, and deletion of elements. It's based on a binary tree, but with specific properties that make it a "search tree."

It is a type of binary tree where each node has the following properties:

1. **Value of left subtree**: All values in the left subtree of a node are **less than** the node's value.
2. **Value of right subtree**: All values in the right subtree of a node are **greater than** the node's value.
3. **No duplicate values**: A BST typically does not allow duplicate values (although you can design a variant of BST that allows them).

## Binary Search Tree Operations

Some basic operations of a binary search tree:

1. **Insertion**: Adding a new node to the tree while maintaining the BST property.
2. **Search**: Finding a node with a specific value in the tree.
3. **Deletion**: Removing a node from the tree while maintaining the BST property.
4. **Traversal**: Visiting all the nodes in a specific order (in-order, pre-order, post-order).
5. **Finding Min/Max**: Finding the minimum or maximum value in the tree.

## Advanced Tree Concepts

1. **Balanced Binary Search Trees**: A standard BST may become unbalanced over time, leading to poor performance (O(n) time complexity). There are specialized balanced BSTs like **AVL trees** and **Red-Black trees** that ensure the tree remains balanced after every insertion and deletion, guaranteeing O(log n) time for operations.

2. **Self-balancing BSTs**: These trees ensure that the height of the tree remains logarithmic (O(log n)) by performing rotations during insertion and deletion.
