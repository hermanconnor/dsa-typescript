# What is a Heap Sort?

Heap Sort is a comparison-based sorting algorithm that uses a binary heap data structure to sort elements. It's known for its efficiency and is often used in applications where time complexity is a concern.

Heap Sort works by first building a max-heap (or min-heap) from the input array and then repeatedly removing the root (which is the largest or smallest element) and placing it at the end of the array. The heap is then re-heapified to maintain the heap property. This process continues until all elements are moved to their sorted positions.

Heap Sort typically uses a **Max-Heap** for sorting in **ascending** order.

### How Does Heap Sort Work?

1. Build a Max-Heap

You start by arranging the elements of the input array in a way that satisfies the max-heap property. This ensures that the largest element is at the root of the tree (i.e., the first element of the array).

2. Swap and Re-heapify

Once the max-heap is built, swap the root of the heap (largest element) with the last element in the array. After swapping, reduce the heap size by 1 and then call a heapify function to restore the max-heap property.

3. Repeat

Repeat this process until the heap size is reduced to 1. The array will be sorted once the heap size is reduced to 0.

4. **Heapify Function:**

Heapify is a process used to maintain the heap property. It is called repeatedly during the extraction phase of heap sort.

- **Max-Heapify**: This process takes a node and ensures that it follows the max-heap property (i.e., its value is greater than or equal to its children). If a child is larger than the node, swap them, and then recursively heapify the affected subtree.

#### Max-Heapify Steps:

1. Compare the current node with its left and right children.
2. Find the largest of the three (current node, left child, right child).
3. If the largest is not the current node, swap it with the largest child.
4. Recursively heapify the affected subtree.

### Time and Space Complexity

- **Time Complexity:** O(n log n)

  - Best Case: O(n log n)
  - Average Case: O(n log n)
  - Worst Case: O(n log n)

- **Overall**: O(n log n)

- **Space Complexity:** O(1) (in-place sorting)

#### Advantages of Heap Sort

- **Efficient:** Guaranteed O(n log n) time complexity.
- **In-place:** Uses constant extra space.
- **Relatively Simple:** Easier to understand and implement than some other advanced sorting algorithms.

#### Disadvantages of Heap Sort

- **Not Stable:** Equal elements might change their relative order.
- **Slightly Slower than Quicksort in Practice:** Although both have O(n log n) average time complexity, Quicksort often performs better in practice due to constant factors. However, Heapsort has a guaranteed O(n log n) time complexity, whereas Quicksort has a worst-case O(n^2) time complexity.

### Summary

Heap Sort is a reliable and efficient sorting algorithm that guarantees **O(n log n)** performance. It's a good choice for scenarios where you need a non-recursive algorithm (no need for additional stack space), and the extra memory required is minimal.
