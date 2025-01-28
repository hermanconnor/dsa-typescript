# What is a Deque?

A **deque** (pronounced "deck") stands for **double-ended queue**. It's a data structure that allows elements to be added or removed from both ends (front and back) efficiently. A deque can be thought of as a combination of both a queue and a stack.

### Key Operations:

Here are the main operations that you can perform on a deque:

1. **`addFirst(item)`** – Adds an element to the front of the deque.
2. **`addLast(item)`** – Adds an element to the back of the deque.
3. **`removeFirst()`** – Removes and returns the element from the front of the deque.
4. **`removeLast()`** – Removes and returns the element from the back of the deque.
5. **`peekFirst()`** – Returns (without removing) the element at the front of the deque.
6. **`peekLast()`** – Returns (without removing) the element at the back of the deque.
7. **`isEmpty()`** – Checks if the deque is empty.
8. **`size()`** – Returns the number of elements in the deque.

### Time Complexity:

- **`addFirst()`**, **`addLast()`**, **`removeFirst()`**, and **`removeLast()`** all have **O(1)** time complexity. This means each operation takes constant time, making a deque very efficient for adding and removing elements from both ends.
- **`peekFirst()`** and **`peekLast()`** are also **O(1)** operations.

### How Does a Deque Work?

Imagine a deque as a dynamic array or linked list where elements can be inserted or removed at both ends with constant time complexity. It behaves like:

- A **queue** when you add elements to the back and remove from the front.
- A **stack** when you add and remove elements from the same end.

A deque can be implemented using:

1. **Arrays** – Easy to implement but may be inefficient for certain operations (like shifting all elements when removing from the front).
2. **Linked Lists** – More efficient, particularly for removing from the front.
