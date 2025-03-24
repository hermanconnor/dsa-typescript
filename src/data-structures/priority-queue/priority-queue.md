# Priority Queue

## What is a Priority Queue?

A priority queue is a type of data structure where each element in the queue has a priority associated with it. The key feature of a priority queue is that elements are dequeued (removed) based on their priority, rather than the order in which they were enqueued (added).

In a standard queue, elements are dequeued in the order they were enqueued (First-In, First-Out or FIFO). However, in a **priority queue**, the element with the highest priority is dequeued first, regardless of when it was added. If two elements have the same priority, they are typically dequeued based on their order of arrival.

### Types of Priority Queues

1. **Max-Heap Priority Queue**: The element with the highest priority (the largest value) is dequeued first. In this structure, the root node is always the largest.
2. **Min-Heap Priority Queue**: The element with the lowest priority (the smallest value) is dequeued first. Here, the root node is always the smallest.

3. **Unsorted List/Array**: This is a more inefficient way of implementing a priority queue. When an element is added, it's placed at the end of the list. When dequeuing, the entire list is searched for the element with the highest (or lowest) priority.

4. **Sorted List/Array**: In this case, the list is kept sorted so that the highest (or lowest) priority element is always at one end. While adding an element requires maintaining the sorted order (which can be expensive), dequeuing is very efficient since it's always O(1) to remove the first or last element.

### Operations in a Priority Queue

The two primary operations in a priority queue are:

1. **Insert (Enqueue)**: Insert an element with a given priority into the queue.
2. **Remove (Dequeue)**: Remove and return the element with the highest (or lowest) priority.

### Priority Queue Implementations

#### 1. **Using a Binary Heap (Max-Heap or Min-Heap)**

The most common way to implement a priority queue is by using a **heap**, a type of binary tree where the parent node satisfies the heap property (either the max-heap or min-heap property).

- **Max-Heap**: In a max-heap, each parent node's value is greater than or equal to the values of its children. This allows efficient access to the largest element, which is always at the root.
- **Min-Heap**: In a min-heap, each parent node’s value is less than or equal to the values of its children. The root node always contains the smallest element.

**Why use heaps?**  
Heaps provide an efficient way of maintaining the priority queue. Both insertion and removal operations can be done in O(log n) time, which is much better than the O(n) time required for a linear structure (like an unsorted list).

#### 2. **Using an Unsorted List/Array**

- Insertion is done in constant time O(1) because the element can simply be added to the end of the list.
- Removal of the highest priority element, however, takes O(n) time because you must scan through the entire list to find the element with the highest priority.

#### 3. **Using a Sorted List/Array**

- Insertion takes O(n) time, since you have to maintain the order of the list.
- Removal of the highest (or lowest) priority element takes O(1) time, as it’s always at one end of the list.

### Use Cases of a Priority Queue

Priority queues are commonly used in algorithms and systems where certain tasks need to be processed based on priority rather than in order of arrival.

1. **Dijkstra's Algorithm**: In graph algorithms like Dijkstra's shortest path algorithm, a priority queue is used to efficiently get the next node to visit based on the shortest distance.
2. **Huffman Encoding**: In data compression algorithms, a priority queue is used to construct the optimal binary tree based on frequency of characters.

3. **Job Scheduling**: In operating systems, tasks with higher priority are executed before tasks with lower priority.

4. **Event-driven Simulation**: In simulations where events are processed in a certain order of priority (e.g., earliest event first), a priority queue can help manage the scheduling of events.

5. **A\* Search Algorithm**: Similar to Dijkstra, the A\* search algorithm uses a priority queue to evaluate which paths to explore next.

### Performance Considerations

- **Time Complexity**:
  - Insertion (Enqueue) in a heap is O(log n), since the heap must be reorganized to maintain the heap property.
  - Removal (Dequeue) in a heap is O(log n), as the root element (with the highest or lowest priority) must be removed and the heap must be rebalanced.
- **Space Complexity**: O(n), where n is the number of elements in the queue, because all elements need to be stored in the queue.

### Summary

A **priority queue** is a powerful data structure where elements are ordered based on priority, not insertion order. It is commonly implemented using a heap, which provides efficient O(log n) operations for insertion and removal. Priority queues are widely used in algorithms, scheduling tasks, and other systems where certain tasks need to be executed before others.
