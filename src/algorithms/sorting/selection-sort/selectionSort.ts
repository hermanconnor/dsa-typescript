/**
 * Sorts an array of numbers using the Selection Sort algorithm.
 * * Selection Sort works by repeatedly finding the minimum element (or maximum) from the
 * unsorted portion and putting it at the beginning of the sorted portion.
 * * * Time Complexity: O(n²) (Worst, Average, and Best Case)
 * - The algorithm performs a fixed number of comparisons regardless of the initial
 * state of the array: n*(n-1)/2 comparisons are always made.
 * - This makes it one of the least efficient sorting algorithms for large lists.
 * * * Space Complexity: O(1)
 * - It is an in-place sort, meaning it only uses a constant amount of extra memory for variables.
 * * @param arr The array of numbers to be sorted.
 * @returns The sorted array (the input array is sorted in place).
 */
export function selectionSort(arr: number[]): number[] {
  // Get the size of the array
  const n = arr.length;

  // Edge case: If the array has 0 or 1 element, it is already sorted.
  if (n <= 1) return arr;

  // Outer loop: Runs n-1 times.
  // 'i' is the boundary between the sorted (left) and unsorted (right) portions.
  for (let i = 0; i < n - 1; i++) {
    // 1. Initialization: Assume the first element of the unsorted subarray is the minimum.
    let minIndex = i;

    // Inner loop: Finds the smallest element in the remaining unsorted subarray (from i+1 to n-1).
    for (let j = i + 1; j < n; j++) {
      // Comparison: Check if the current element is smaller than the smallest found so far.
      if (arr[j] < arr[minIndex]) {
        // Update the index of the minimum element found.
        minIndex = j;
      }
    }

    // 2. Swap: Place the minimum element found in the inner loop into its correct position.
    // This position is marked by the boundary 'i'.
    // Only swap if the smallest element is not already at the current boundary 'i' (an optimization).
    if (minIndex !== i) {
      // ES6 array destructuring for a clean swap operation.
      // Swap arr[i] (current start of unsorted) with arr[minIndex] (the true minimum).
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }

    // After this outer loop iteration, the element at arr[i] is correctly sorted.
    //
  }

  return arr;
}
