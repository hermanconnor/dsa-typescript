# What is Linear Search?

**Linear search** is an algorithm that checks each element in a list or array, one by one, in sequence until it finds the target element or reaches the end of the list. It is called _linear_ because it checks the elements in a linear fashion from the start to the end. Think of it like looking for a specific book on a shelf by checking each book one by one until you find the right one.

### How Linear Search Works

1. **Start at the beginning:** Start from the first element in the array.
2. **Compare:** Compare the current element with the target value you're searching for.
3. **Match?** If the current element matches the target, the search is successful, and the index (position) of the element is returned.
4. **No Match?** If the current element does _not_ match the target, the algorithm moves to the next element in the list.
5. **End of List:** If the algorithm reaches the end of the list without finding a match, the search is unsuccessful, and it typically returns a special value like `-1` to indicate this.

Linear search is good for **unsorted** arrays or lists. It’s a simple and easy-to-implement approach, but it’s not efficient for large datasets compared to more advanced searching algorithms like **binary search** (which requires sorted arrays).

### Time and Space Complexity

- **Time Complexity:** Linear search has a time complexity of O(n), where n is the number of elements in the list. In the worst-case scenario (the target is the last element or not present), you have to examine every element.

- **Best Case:** The best-case scenario is when the target element is the first element in the list. In this case, the time complexity is O(1).
- **Average Case:** On average, you'll need to check about half the elements, so the average time complexity is still O(n).
- **Space Complexity:** Linear search has a space complexity of O(1) because it only uses a constant amount of extra memory (for the loop counter `i`). It doesn't require any additional data structures that scale with the input size.

- **Time Complexity**: Linear search has a time complexity of O(n), where n is the number of elements in the list. In the worst-case scenario (the target is the last element or not present), you have to examine every element.

  - **Best case**: O(1) — If the target element is the first one.
  - **Worst case**: O(n) — If the target element is the last one or not found.
  - **Average case**: O(n) — On average, the target element is found halfway through the list.

- **Space Complexity**: O(1) — Only requires a constant amount of extra space.

#### When to Use Linear Search

- **Suitable for:**
  - Small lists or arrays.
  - Unsorted lists (where other faster algorithms like binary search can't be used).
  - When you only need to search occasionally, and the overhead of sorting (required for binary search) is not worth it.
- **Not Suitable for:** Large datasets where performance is critical. For large datasets, algorithms like binary search (for sorted data) are much more efficient.

### Summary

- **Linear search** is a simple, brute-force approach to finding an element in an array.
- It works on both sorted and unsorted arrays.
- The time complexity is O(n) in the worst case, meaning it's not efficient for large datasets.
