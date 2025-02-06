# What is a Heap?

A **Heap** is a special binary tree-based data structure that satisfies the **heap property**. This property dictates the relationship between parent and child nodes. There are two main types of heaps:

1. **Max-Heap**: In a max-heap, the value of each node is greater than or equal to the values of its children. In other words, the root node contains the largest value, and the same applies recursively for all subtrees.
2. **Min-Heap**: In a min-heap, the value of each node is less than or equal to the values of its children. The root node contains the smallest value, and this applies recursively for all subtrees.

## Heap Characteristics

Heaps are often implemented as **complete binary trees**. A complete binary tree is a tree in which all levels are completely filled except possibly the last level, which has its nodes filled from left to right. This structure allows efficient storage in an array.

1. **Complete Binary Tree**: A heap is always a **complete binary tree**, meaning that all levels are completely filled except possibly for the last level, which is filled from left to right.

2. **Shape Property**: The heap must satisfy the complete binary tree property.

3. **Heap Property**:
   - **Max-Heap**: Parent nodes are greater than or equal to their children.
   - **Min-Heap**: Parent nodes are less than or equal to their children.

## Heap Operations

A heap supports several fundamental operations, each of which can be implemented efficiently.

1. **`insert(value)`:** Adds a new element to the heap while maintaining the heap property. This usually involves placing the new element at the end of the array and then "bubbling up" or "sifting up" the element by swapping it with its parent until the heap property is restored.
2. **`extractMin()` (Min-Heap) or `extractMax()` (Max-Heap):** Removes and returns the root element (the smallest or largest). This involves replacing the root with the last element in the array, then "bubbling down" or "sifting down" the new root by swapping it with its smaller (min-heap) or larger (max-heap) child until the heap property is restored.
3. **`peek()` or `findMin()` (Min-Heap) or `findMax()` (Max-Heap):** Returns the root element (the smallest or largest) without removing it.
4. **`heapify()`:** Converts an array into a heap. A common approach is to start from the last non-leaf node and bubble down all the nodes to satisfy the heap property.

## **Applications of Heaps**

Some use cases for heaps

1. **Priority Queue**: Heaps are often used to implement **priority queues** where the element with the highest (or lowest) priority is always at the top. Max-heaps are used for max-priority queues, while min-heaps are used for min-priority queues.

2. **Heap Sort**: Heaps can be used for sorting an array efficiently. The algorithm works by first building a heap from the array, then repeatedly extracting the root (which gives the largest or smallest element), and rebuilding the heap after each extraction.

3. **Dijkstra's Algorithm**: A priority queue implemented using a heap can help efficiently find the shortest path in graphs.

4. **Memory Management**: Heaps can be used in memory management for efficiently allocating and deallocating memory blocks.

5. **Finding k-largest/k-smallest elements:** Efficiently find the k largest or smallest elements in a dataset.
