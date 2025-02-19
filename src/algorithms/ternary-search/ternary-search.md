# What is Ternary Search?

**Ternary search** is a divide-and-conquer algorithm that works by dividing the search space into **three parts** instead of two (as in binary search). It compares the target element with two middle elements, and based on these comparisons, it narrows down the search range by one-third in each step. It's used to find the maximum or minimum value of a unimodal function (a function that has only one peak or valley). It can also be used for searching sorted arrays, but binary search is generally preferred in that case due to its greater efficiency.

### How Ternary Search Works

1. **Start with three pointers**:
   - `left`, `mid1`, and `mid2` where `mid1` and `mid2` divide the array into three equal (or nearly equal) parts.
2. **Divide the array into three parts**:
   - Calculate two middle indices: `mid1 = left + (right - left) / 3` and `mid2 = right - (right - left) / 3`.
   - These divide the search space into three ranges:
     - From `left` to `mid1`
     - From `mid1 + 1` to `mid2`
     - From `mid2 + 1` to `right`
3. **Compare the target with the middle elements**:
   - If the target is equal to the element at `mid1`, return `mid1`.
   - If the target is equal to the element at `mid2`, return `mid2`.
   - If the target is less than the element at `mid1`, narrow the search to the left third (update `right = mid1 - 1`).
   - If the target is greater than the element at `mid2`, narrow the search to the right third (update `left = mid2 + 1`).
   - If the target is between the two middle elements, search in the middle third (update `left = mid1 + 1` and `right = mid2 - 1`).
4. **Repeat the process**: Narrow the search space and continue until the target is found or the search space is empty (`left > right`).

### Time and Space Complexity

- **Time Complexity**: Ternary search has a time complexity of O(log₃ n).

  - **Best case**: O(1) — If the target is found at one of the middle positions.
  - **Worst case**: O(log₃ n) — Since the search space is divided by 3 in each step, the number of steps grows logarithmically to the base 3. This is slower than binary search's O(log₂ n), but still efficient.
  - **Average case**: O(log₃ n).

- **Space Complexity**: O(1) — Ternary search works in-place and requires only a constant amount of extra space.

### When to Use Ternary Search

- **Sorted arrays**: Like binary search, ternary search works on sorted arrays (or other data structures that allow random access).
- It’s useful when the problem has an optimization or decision-making aspect where dividing the search space into three parts may provide some advantage (although this is rare compared to binary search).
- Ternary search can be used in specific mathematical or optimization problems that require reducing a range into three parts instead of two.
- Finding the minimum or maximum of unimodal functions.

### Summary

- **Ternary search** is a divide-and-conquer algorithm that divides the search space into three parts. This can sometimes offer improvements depending on the specific problem, though it’s not commonly used as much as binary search.
- It has a **time complexity of O(log₃ n)**, which is theoretically slower than binary search (O(log₂ n)) but still logarithmic.
- Ternary search can be useful for some special **optimization problems** but is not as widely used as binary search in general-purpose searching tasks.

While you _can_ use ternary search on sorted arrays, binary search is more efficient. Ternary search is useful for optimization problems involving unimodal functions. However, for searching sorted arrays, binary search is the preferred and more efficient algorithm.
