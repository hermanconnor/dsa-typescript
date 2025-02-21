# What is Exponential Search?

**Exponential search** is a search algorithm that works by exponentially increasing the range of search at each step. It’s often used in situations where we don’t know the size of the array or when the array is too large to directly index all at once.

Exponential search starts by checking the first element, then the second element, then the fourth, the eighth, and so on, doubling the search range each time. This exponential growth helps to quickly narrow down the range where the target might be.

Once we find the interval in which the target might exist, we can apply binary search within that range to find the exact position of the element.

### How Exponential Search Works

1. **Step 1: Exponentially find a range**:
   - Start by checking the first element.
   - Then check the second element (`arr[2]`), then the fourth element (`arr[4]`), then the eighth element (`arr[8]`), and so on. This is done by repeatedly doubling the index.
2. **Step 2: Apply binary search within the range**:

   - Once you find an element that is greater than the target, perform a **binary search** on the range between the last element checked and the current element. This range is where the target might be.

3. **Step 3: Return the index**:
   - If the target is found during the binary search phase, return the index; otherwise, return `-1` (target not found).

### Time and Space Complexity

- **Time Complexity**: The time complexity of exponential search is O(log n), where n is the number of elements.

  - **Worst-case time complexity**: O(log n). This is the time complexity of binary search applied to a range that’s exponentially narrowed down.
  - **Best-case time complexity**: O(1) — If the target is found in the first few steps, it may be found instantly.

- **Space Complexity**: O(1), because it only needs a constant amount of extra space (just for a few pointers/indices).

### Summary

- **Exponential search** is a search algorithm for sorted arrays that works by exponentially increasing the range and then applying binary search to the range where the target might be.
- **Time complexity** is O(log n) after finding the range, and the **space complexity** is O(1).
- It is especially useful for infinite or very large arrays, or situations where you don't know the size of the array upfront.
- Exponential search is efficient but not as commonly used as binary search, and is typically only applied in special use cases.
