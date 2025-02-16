# What is Counting Sort?

Counting Sort is a stable, non-comparative sorting algorithm that counts how many times each distinct element appears in the input array. Based on these counts, it can reconstruct the sorted output. This algorithm is particularly useful when you have a fixed, limited range of integers, and the values in the array are known to be within a specific range.

- **Stable** sorting algorithm that preserves the relative order of equal elements.

### How Does Counting Sort Work?

1. **Find the Range of the Elements**:

   - Identify the minimum and maximum values in the array. These will be used to determine the size of the count array.

2. **Count the Occurrences**:

   - Create a count array (let's call it `count[]`) where each index corresponds to a possible element in the input array.
   - For each element in the input array, increment the count at the index corresponding to that element.

3. **Accumulate the Counts**:

   - Modify the count array so that each element at index `i` now stores the sum of previous counts. This gives the positions of each element in the sorted output array.

4. **Place Elements in the Output Array**:

   - Traverse the input array, and for each element, place it at its correct position in the output array using the count array.
   - After placing the element, decrement the corresponding count value to ensure that duplicates are placed in the correct order.

5. **Copy the Output Array Back to the Input Array**:
   - Finally, copy the sorted output array back into the original array (optional, depending on whether you need an in-place sort).

### Time and Space Complexity

- **Time Complexity**:

  - **Best, Average, and Worst Case**: \(O(n + k)\), where \(n\) is the number of elements in the input array and \(k\) is the range of the input (i.e., the maximum value minus the minimum value).
  - Counting Sort is linear when \(k\) is small relative to \(n\), but if the range of input values is large (i.e., \(k\) is large), the performance may degrade.

- **Space Complexity**:

  - **\(O(n + k)\)**, because we need to allocate space for both the count array and the output array.
  - If the range \(k\) is large, the space complexity might also become a concern.

- **Stable Sorting**: Counting Sort is stable, meaning that it preserves the relative order of elements that are equal (important in certain applications).

### Summary

**Counting Sort** is a non-comparative integer sorting algorithm that is highly efficient when the range of input values is known and relatively small compared to the size of the array. It works by counting the occurrences of each distinct element in the input array and using this information to place each element in its correct sorted position.

- It has a time complexity of \(O(n + k)\), where \(n\) is the number of elements and \(k\) is the range of values.
- It works by counting the occurrences of each element and using those counts to reconstruct a sorted array.
- It is efficient when the range of the input is small, but it becomes inefficient if the range is large compared to the number of elements.
