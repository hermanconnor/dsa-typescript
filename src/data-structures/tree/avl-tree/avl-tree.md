# What is an AVL Tree?

An **AVL tree** is a type of **self-balancing binary search tree** (BST). The name **AVL** comes from the initials of its inventors, **Adelson-Velsky** and **Landis**, who introduced the tree in 1962.

### What makes it special:

1. **Binary Search Tree (BST)**: Like all BSTs, an AVL Tree follows the rule where for any node:

   - The left child has a value less than the parent.
   - The right child has a value greater than the parent.

2. **Self-balancing**: The key difference between a regular BST and an AVL tree is that the AVL tree is **self-balancing**. This means it automatically adjusts itself to make sure the tree remains balanced after every insertion or deletion.

### Why balance matters:

In a regular BST, if nodes are inserted in a sorted order (like 1, 2, 3, 4, 5), the tree could degenerate into a "linked list," making search operations slow (O(n) instead of O(log n)). The AVL tree solves this problem by keeping the tree balanced.

### Balancing Condition (The "Balance Factor"):

For any node in an AVL Tree, the difference in heights between its left and right subtrees must be no more than 1. This difference is called the **balance factor** and is calculated as:

     Balance Factor = Height of Left Subtree - Height of Right Subtree

- If the balance factor is **-1**, **0**, or **1**, the tree is considered balanced.
- If it's outside this range (i.e., less than -1 or greater than 1), the tree needs to be **rebalanced**.

### How it Stays Balanced: Rotations

If the tree becomes unbalanced (balance factor goes beyond 1 or -1), it performs one of the following rotations to restore balance:

1. **Left-Left (LL) Rotation**: When the left subtree of the left child is too tall.
2. **Right-Right (RR) Rotation**: When the right subtree of the right child is too tall.
3. **Left-Right (LR) Rotation**: When the right subtree of the left child is too tall.
4. **Right-Left (RL) Rotation**: When the left subtree of the right child is too tall.

### Insertion and Deletion:

- **Insertion**: After inserting a new node, the AVL tree checks if it’s balanced. If not, it performs the necessary rotation(s) to restore balance.
- **Deletion**: When deleting a node, the AVL tree may become unbalanced, and it will again perform rotations to restore balance.

### Time Complexity:

- **Search, Insertion, and Deletion**: These operations are **O(log n)** because the tree is balanced, and the height of the tree remains logarithmic with respect to the number of nodes.

### Why Use an AVL Tree?

The main advantage of an AVL tree is that it guarantees **logarithmic height**, which ensures efficient operations even as the tree grows. It is useful when you need fast lookups and frequent insertions/deletions while maintaining a balanced structure.
