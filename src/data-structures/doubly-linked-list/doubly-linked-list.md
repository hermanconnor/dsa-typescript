# What is a Doubly Linked List?

A **Doubly Linked List** is a type of linked list in which each node contains three parts:

1. **Value**: The actual value or data the node is storing.
2. **Next Pointer**: A reference (or pointer) to the next node in the sequence.
3. **Previous Pointer**: A reference (or pointer) to the previous node in the sequence.

Unlike a **singly linked list**, where each node only has a pointer to the next node, a doubly linked list allows for navigation in both directions: forward (next) and backward (previous).

### Structure of a Doubly Linked List:

Here’s a visual representation:

```
null ← [Prev | Value | Next] ↔ [Prev | Value | Next] ↔ [Prev | Value | Next] → null
```

- The first node has its **previous** pointer set to `null` (because there's no node before it).
- The last node has its **next** pointer set to `null` (because there's no node after it).

### Key Operations on a Doubly Linked List:

#### 1. **Insertion**

- **At the beginning**: You create a new node and update the head pointer to this new node. You also set the new node’s `next` pointer to the old head, and the old head’s `prev` pointer to the new node.
- **At the end**: You traverse to the last node and update its `next` pointer to point to the new node. Then, you set the new node’s `prev` pointer to the old tail node.
- **At a specific position**: You traverse the list to find the desired position and insert a new node by adjusting the `prev` and `next` pointers of surrounding nodes.

#### 2. **Deletion**

- **At the beginning**: You update the head pointer to the second node in the list. You then set the second node’s `prev` pointer to `null`.
- **At the end**: You traverse to the last node, set the second-to-last node's `next` pointer to `null`, and remove the last node.
- **At a specific position**: You traverse the list to the node to be deleted and adjust the `prev` and `next` pointers of the adjacent nodes accordingly.

#### 3. **Traversal**

- **Forward Traversal**: You start from the head node and follow the `next` pointers until you reach a node where `next` is `null`.
- **Backward Traversal**: You start from the tail node and follow the `prev` pointers until you reach a node where `prev` is `null`.

### Advantages of a Doubly Linked List:

- **Bidirectional Traversal**: You can traverse in both directions, making certain operations (like deletion from the end) faster than with a singly linked list.
- **Efficient Deletion**: Deleting a node in the middle of the list is more efficient than in a singly linked list, because you can directly access the previous node (no need to traverse from the head to find it).

### Disadvantages:

- **More Memory Usage**: Each node requires two pointers (next and prev), which uses more memory compared to a singly linked list.
- **More Complex Operations**: The logic for insertion and deletion is slightly more complicated than for a singly linked list because you need to handle the `prev` and `next` pointers carefully.
