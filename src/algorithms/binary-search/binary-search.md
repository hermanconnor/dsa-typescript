# What is Binary Search?

Binary search is an algorithm that finds the position of a target value within a **sorted array**. Instead of checking every element one-by-one like in linear search, binary search takes advantage of the sorted order to repeatedly divide the search interval in half, dramatically reducing the number of comparisons.

### How Binary Search Works

1. **Start with two pointers**: One at the beginning of the array (`left`) and the other at the end of the array (`right`).
2. **Find the middle element**: Calculate the middle index, `mid = Math.floor((left + right) / 2)`.
3. **Compare the target with the middle element**:
   - If the middle element is equal to the target, you've found the target, and you return the index.
   - If the target is less than the middle element, narrow your search to the left half (`right = mid - 1`).
   - If the target is greater than the middle element, narrow your search to the right half (`left = mid + 1`).
4. **Repeat the process**: You keep repeating steps 2 and 3, halving the search space each time, until the target is found or the search space is empty (`left > right`).

### Time and Space Complexity

- **Time Complexity**: Binary search has a time complexity of O(log n), where n is the number of elements. This is _much_ faster than linear search for large datasets. Each comparison effectively halves the search space.

  - **Best case**: O(1) — If the middle element is the target.
  - **Worst case**: O(log n) — With each step, the search space is halved.
  - **Average case**: O(log n) — Same as worst case because of how the array is divided.

- **Space Complexity**: O(1) — Binary search only needs a constant amount of extra space.

### When to Use Binary Search

- Binary search works **only on sorted arrays** or lists.
- It’s very efficient for large datasets because of its O(log n) time complexity.
- You cannot use binary search on **unsorted** arrays unless you sort them first, which may add overhead.

### Summary

- **Binary search** is an efficient algorithm with a time complexity of O(log n), but it requires a sorted array to function properly.
- It works by continually halving the search space until the target is found (or determined to be absent).
- Binary search is far more efficient than linear search for large datasets but can only be used on sorted data.
