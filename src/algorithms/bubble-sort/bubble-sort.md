# What is Bubble Sort?

Bubble sort is a basic sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. The pass through the list is repeated until the list is sorted.

The name comes from the way larger elements "bubble" to the top of the array with each pass, as the larger elements are swapped with the smaller ones.

## Concept of Bubble Sort

1. **Start at the beginning of the array.**
2. **Compare the current element with the next element.**
   - If the current element is greater than the next, **swap** them.
   - If not, move to the next pair.
3. **Repeat the process for the whole array.**
4. **Repeat the whole process for all the elements in the list** until no swaps are made (indicating the array is sorted).

### Time Complexity:

- **Best case**: \(O(n)\), when the array is already sorted (but it needs to check the whole array once).
- **Average and Worst case**: \(O(n^2)\), because in the worst case, the algorithm has to compare and swap every pair of adjacent elements.

### Space Complexity:

- \(O(1)\), as it is an **in-place** sorting algorithm. No additional space is needed.

## Summary:

Bubble sort is simple but inefficient with a time complexity of \(O(n^2)\) in the worst and average cases. It’s a simple algorithm and helps understand basic sorting mechanics. Given its inefficiency, bubble sort isn’t suitable for large datasets, but can work for small datasets where its simplicity can be beneficial. It’s ideal for learning purposes but not for real-world applications when performance matters.
