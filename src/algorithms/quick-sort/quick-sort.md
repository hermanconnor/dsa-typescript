# What is Quick Sort?

Quick Sort is a **divide-and-conquer** sorting algorithm. It works by selecting a "pivot" element from the array and partitioning the other elements into two groups:

1. Elements smaller than the pivot.
2. Elements greater than the pivot.

These two groups are then sorted recursively. Quick Sort is efficient because it divides the array into smaller subarrays, sorting each of them individually.

### How Quick Sort Works

1. **Choose a pivot**: Pick an element from the array. This could be the first, last, middle, or even a random element.
2. **Partition the array**: Rearrange the elements of the array so that:
   - All elements smaller than the pivot are on its left.
   - All elements greater than the pivot are on its right.
3. **Recursively sort**: Apply the same procedure to the subarrays on the left and right of the pivot.
4. **Base case**: When the array (or subarray) has 1 or fewer elements, it's considered sorted.

### Choosing a Good Pivot

The choice of pivot can greatly affect the performance of Quick Sort. Ideally, the pivot should divide the array into roughly equal parts. Some common strategies include:

- **First element**: Simply choose the first element as the pivot (simple but not always efficient).
- **Last element**: Choose the last element as the pivot (common in simple implementations).
- **Random pivot**: Randomly select a pivot to avoid the worst-case performance in already sorted arrays.
- **Median of three**: Choose the pivot as the median of the first, middle, and last elements. This tends to improve the performance in many cases.

### Time Complexity

- **Best case**: \(O(n \log n)\) – This occurs when the pivot divides the array into nearly equal parts.
- **Average case**: \(O(n \log n)\) – On average, Quick Sort performs well because the pivot tends to divide the array into relatively equal parts.
- **Worst case**: \(O(n^2)\) – This happens when the pivot consistently divides the array into one large subarray and one empty subarray (e.g., when the array is already sorted or reversed). This is rare in practice, especially if a good pivot selection strategy is used.

### Space Complexity

- **\(O(\log n)\)** on average, because Quick Sort is a recursive algorithm, and each recursive call adds a level to the call stack. In the worst case, the space complexity can go up to \(O(n)\) if the array is poorly divided (i.e., the pivot consistently splits the array unevenly).

### Why Quick Sort is Efficient:

- **Partitioning**: The algorithm sorts the array by dividing it into smaller subarrays, which is much faster than comparing and swapping adjacent elements like in Bubble Sort or Selection Sort.
- **Average-case performance**: Quick Sort usually performs very well in practice with its \(O(n \log n)\) average time complexity.

### Summary

- **Quick Sort** is an efficient, divide-and-conquer algorithm with an average time complexity of \(O(n \log n)\).
- It works by selecting a pivot and partitioning the array into two subarrays, then recursively sorting the subarrays.
- **Worst-case time complexity** can be \(O(n^2)\), but this is rare with a good pivot selection strategy.
- Quick Sort is **in-place** and generally faster than algorithms like Merge Sort because it doesn’t require extra space for merging.
