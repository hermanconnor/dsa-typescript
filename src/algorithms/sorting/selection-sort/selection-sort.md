# What is Selection Sort?

Selection Sort is a comparison-based sorting algorithm that divides the list into two parts: a sorted part and an unsorted part. It repeatedly selects the smallest (or largest) element from the unsorted part and swaps it with the first unsorted element. This process continues until the entire list is sorted.

### How Selection Sort Works

1. **Start with the first element** in the array (consider this part of the array as sorted, and the rest as unsorted).
2. **Find the smallest element** in the unsorted portion of the array.
3. **Swap the smallest element** with the first element in the unsorted portion.
4. **Move the boundary** between the sorted and unsorted portions one step to the right.
5. **Repeat steps 2-4** until the unsorted portion becomes empty.

### Time Complexity

- **Best, Worst, and Average case**: \(O(n^2)\), because in every iteration, we have to search through the entire unsorted part of the array to find the minimum element. It doesn't benefit from a sorted input.

### Space Complexity

- **\(O(1)\)**, because Selection Sort is an **in-place** algorithm. It doesn't use any extra memory other than a few variables for swapping.

### Summary

- Selection sort is simple and intuitive but inefficient for large datasets, with a time complexity of \(O(n^2)\).
- It’s **in-place** and has a **space complexity of \(O(1)\)**.
- **Fewer swaps** than bubble sort but still less efficient compared to more advanced algorithms like quicksort and mergesort.

Selection Sort is one of the simpler sorting algorithms, but it’s not typically used in practice for large data due to its inefficiency. However, it’s a great starting point for learning the basics of sorting.
