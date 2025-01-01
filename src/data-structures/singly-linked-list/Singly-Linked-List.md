# Singly Linked List

## **What is a Singly Linked List (SLL)?**

A **Singly Linked List** is a linear data structure where each element (node) in the list points to the next element in the sequence. It has the following characteristics:

- **Node Structure**: Each node contains two parts:
  1. **Value**: The actual data that the node holds.
  2. **Next**: A pointer (or reference) to the next node in the list.
- **Head**: The first node in the list. If the list is empty, this is `null` or `undefined`.
- **Tail**: In some implementations, you might also keep a reference to the last node for easier access to the end of the list.

Here’s a basic diagram of a singly linked list:

```
{Value | Next} -> {Value | Next} -> {Value | Next} -> null
```

### **Basic Operations on Singly Linked Lists**

Here are some common operations typically implemented for singly linked lists:

1. **Insertion**:
   - **At the beginning (head)**: Add a node at the start of the list.
   - **At the end (tail)**: Add a node at the end of the list.
   - **At a specific position**: Insert a node at a given position (not just at the start or end).
2. **Deletion**:

   - **From the beginning (head)**: Remove the first node.
   - **From the end (tail)**: Remove the last node.
   - **From a specific position**: Remove a node from a given position.

3. **Traversal**:

   - **Display all elements**: Traverse the list to print or return all elements.

4. **Search**:

   - **Find a value**: Search for a specific value in the list.

5. **Length**:

   - **Count nodes**: Return the number of nodes in the list.

6. **Reverse**:
   - **Reverse the list**: Change the order of the nodes so that the last node becomes the first one and vice versa.

### **Time Complexity of Operations**

For operations implemented on this singly linked list

- **unshift(element)**: O(1)
- **push(element)**: O(1)
- **shift()**: O(1)
- **pop()**: O(1)
- **insertNodeAt(index, element)**: O(n)
- **removeNodeAt(element)**: O(n)
- **setNodeAt(index, element)**: O(n)
- **getNodeAt(index)**: O(n)
- **getHead()**: O(1)
- **getTail()**: O(1)
- **deleteHead()**: O(1)
- **deleteTail()**: O(n)
- **deleteAt(index)**: O(n)
- **contains(element)**: O(n)
- **indexOf(element)**: O(n)
- **reverse()**: O(n)
- **isEmpty()**: O(1)
- **size()**: O(1)
- **printList()**: O(n)
