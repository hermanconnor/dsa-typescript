/**
 * Sorts an array of numbers using the Bubble Sort algorithm.
 * * Bubble Sort repeatedly steps through the list, compares adjacent elements,
 * and swaps them if they are in the wrong order. The pass through the list is
 * repeated until the list is sorted.
 * * * Time Complexity:
 * - Worst and Average Case: O(n²)
 * - This occurs when the array is sorted in reverse order (worst) or is randomly ordered.
 * It requires comparing every pair of elements multiple times.
 * - Best Case: O(n)
 * - This occurs when the array is already sorted. The outer loop runs once,
 * the inner loop runs n-1 times, and the `swapped` flag is false, causing an early break.
 * * * Space Complexity: O(1)
 * - It is an in-place sort, meaning it only uses a constant amount of extra memory for variables
 * like `i`, `j`, `n`, and `swapped`.
 * * @param arr The array of numbers to be sorted.
 * @returns The sorted array (the input array is sorted in place).
 */
export function bubbleSort(arr: number[]): number[] {
  // Get the size of the array
  const n = arr.length;

  // Edge case: If the array has 0 or 1 element, it is already sorted.
  if (n <= 1) return arr;

  let swapped: boolean; // Flag to track if any swaps occurred in a pass.

  // Outer loop: Runs n-1 times (at most).
  // `i` represents the number of elements already placed correctly at the end of the array.
  for (let i = 0; i < n - 1; i++) {
    swapped = false; // Reset the flag for the start of a new pass.

    // Inner loop: Performs the comparisons and swaps.
    // We only need to iterate up to the beginning of the sorted section (`n - 1 - i`).
    // The largest `i` elements are already in their final position at the end.
    for (let j = 0; j < n - 1 - i; j++) {
      // Comparison: Check if the current element is greater than the next adjacent element.
      if (arr[j] > arr[j + 1]) {
        // Swap: If the elements are out of order, swap them (Bubble action).
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

        // Mark that a swap occurred in this pass.
        swapped = true;
      }
    }

    // Optimization: Early exit for already sorted array.
    // If the inner loop completed without any swaps, the array must be sorted.
    if (!swapped) break;

    // After this pass, the element at arr[n - 1 - i] is guaranteed to be the largest
    // among the remaining unsorted elements.
    //
  }

  return arr;
}
