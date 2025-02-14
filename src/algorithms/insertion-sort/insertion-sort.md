## What is Insertion Sort?

**Insertion Sort**, is another basic but widely used sorting algorithm. It’s particularly efficient for small datasets or nearly sorted arrays. Insertion Sort works similarly to how you might sort playing cards in your hands. You start with one card, and then, for each new card, you insert it into its correct position relative to the cards you’ve already sorted.

The algorithm works by **inserting** each new element into its correct position among the already sorted elements, like inserting a new card into a hand of cards.

- **Start with the second element** of the array (the first element is considered "sorted").
- **Compare it to the elements before it** (from right to left), and **insert it into the correct position** to maintain the sorted order.
- **Repeat this process** for every element until the entire array is sorted.

### How Insertion Sort Works

1. **Start from the second element** (because the first is trivially sorted).
2. **Compare it with the previous elements** one by one, moving from right to left.
3. **Shift elements to the right** until you find the correct spot for the current element.
4. **Insert the current element** into its correct position.
5. **Repeat for all subsequent elements**.

### Time Complexity

- **Best case**: \(O(n)\), when the array is already sorted. The algorithm only needs to compare each element once.
- **Average and Worst case**: \(O(n^2)\), because in the worst case (when the array is reversed), each new element must be compared with all previously sorted elements.

### Space Complexity

- **\(O(1)\)**, because Insertion Sort is an **in-place** sorting algorithm. It doesn’t require extra memory.

### Summary

Insertion Sort is simple and efficient for small or nearly sorted arrays with a time complexity of \(O(n^2)\) in the average and worst cases. It’s an **in-place** sorting algorithm with a **space complexity of \(O(1)\)**. It can perform better than other \(O(n^2)\) algorithms in certain cases, like when the input is nearly sorted.
