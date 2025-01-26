# What is a Queue?

A Queue is a linear data structure that follows the **First In First Out** (FIFO) principle. This means the first element added to the queue will be the first one to be removed. Imagine a line at a ticket counter – the first person in line is the first to get served, and the last person joins the end of the line.

## Key Characteristics

- **FIFO (First-In, First-Out):** The element that enters the queue first is the first one to be removed.
- **Linear Data Structure:** Elements are arranged in a sequential order.
- **Two Main Operations:**
  - **Enqueue:** Adds an element to the rear (end) of the queue.
  - **Dequeue:** Removes an element from the front of the queue.

## Types of Queues

- **Simple Queue**: This is the basic FIFO queue described above, with the standard enqueue and dequeue operations.
- **Circular Queue**: A queue where the last position connects back to the first position (helpful for reducing memory usage when using arrays).
- **Priority Queue**: A special queue where each element has a priority based on a certain criteria (e.g., urgency, importance). Elements with higher priority are dequeued before those with lower priority, even if they entered the queue later.
- **Deque (Double-Ended Queue):** Allows insertion and deletion from both the front and rear.

## Basic Operations of a Queue

The operations that are typically supported by a Queue are:

1. **Enqueue** – Adds an element to the end of the queue.
2. **Dequeue** – Removes and returns the element from the front of the queue.
3. **Peek/Front** – Returns the element at the front without removing it.
4. **IsEmpty** – Checks if the queue has any elements.
5. **Size** – Returns the number of elements in the queue.
