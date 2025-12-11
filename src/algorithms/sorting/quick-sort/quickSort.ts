/**
 * Sorts an array of numbers using the QuickSort algorithm.
 *
 * This is the public facing function that initializes the sorting process
 * and protects the original array by sorting a copy.
 *
 * @param {number[]} arr The array of numbers to be sorted.
 * @returns {number[]} A new, sorted array.
 *
 * @timecomplexity Best/Average Case: O(n log n). The array is divided roughly in half at each step.
 * Worst Case: O(n²) (If the pivot selection consistently results in highly unbalanced partitions,
 * though 'median of three' attempts to avoid this).
 * @spacecomplexity O(n) for the copy of the array. O(log n) auxiliary space for the recursion stack
 * (due to the depth of the recursion, which is log n in the average case).
 *
 */
export function quickSort(arr: number[]): number[] {
  // Create a copy of the array to ensure the input array is not mutated (non-destructive sort).
  const sorted = [...arr];

  // Start the recursive helper function on the entire copied array.
  quickSortHelper(sorted, 0, sorted.length - 1);

  // Return the sorted copy.
  return sorted;
}

/**
 * A recursive helper function to perform the QuickSort.
 * It implements the Divide and Conquer strategy.
 *
 * @param {number[]} arr The array slice currently being sorted in place.
 * @param {number} low The starting index of the sub-array slice.
 * @param {number} high The ending index of the sub-array slice.
 * @returns {void} The sorting is done in place on the array reference passed.
 *
 * @timecomplexity Inherits complexity from the main quicksort function.
 * @spacecomplexity O(log n) auxiliary space for the recursion stack depth.
 */
function quickSortHelper(arr: number[], low: number, high: number): void {
  // Base case: if low is greater than or equal to high, the sub-array has 0 or 1 element,
  // which is already sorted. Stop recursion.
  if (low < high) {
    // 1. DIVIDE: Partition the sub-array around a pivot element.
    // pivotIndex is the final, sorted position of the pivot element.
    const pivotIndex = partition(arr, low, high);

    // 2. CONQUER: Recursively sort the elements before the pivot.
    quickSortHelper(arr, low, pivotIndex - 1);

    // 3. CONQUER: Recursively sort the elements after the pivot.
    quickSortHelper(arr, pivotIndex + 1, high);
  }
}

/**
 * Rearranges the sub-array in place such that all elements less than or equal to
 * the pivot are on the left, and all greater elements are on the right.
 * This is the core 'partition' step.
 *
 * @param {number[]} arr The array slice to partition.
 * @param {number} low The starting index.
 * @param {number} high The ending index.
 * @returns {number} The final index of the pivot element.
 *
 * @timecomplexity O(n), where n is the size of the sub-array (high - low + 1), because
 * it iterates through every element once.
 * @spacecomplexity O(1) auxiliary space.
 */
function partition(arr: number[], low: number, high: number): number {
  // 1. Pivot Selection: Use 'median of three' to get a better pivot index.
  const pivot = medianOfThree(arr, low, high);
  const pivotValue = arr[pivot];

  // Move the selected pivot to the 'high' end for easier partitioning logic (Hoare/Lomuto hybrid approach).
  // This swap puts the pivot out of the way of the main loop.
  [arr[pivot], arr[high]] = [arr[high], arr[pivot]];

  // 'i' tracks the boundary between the 'less than or equal to pivot' elements (left)
  // and the 'greater than pivot' elements (middle). It starts one position *before* the first element.
  let i = low - 1;

  // 'j' iterates through the array from 'low' up to, but not including, the pivot at 'high'.
  for (let j = low; j < high; j++) {
    // If the current element is less than or equal to the pivot value...
    if (arr[j] <= pivotValue) {
      // ...increment 'i' to expand the 'less than or equal to' section...
      i++;
      // ...and swap arr[i] with arr[j]. This moves the smaller element into the
      // 'less than or equal to' section, and moves a larger element out of it.
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  // Final swap: Move the pivot (currently at arr[high]) into its final sorted position,
  // which is one position past the last element in the 'less than or equal to' section (i + 1).
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

  // Return the final index of the pivot.
  return i + 1;
}

/**
 * Selects the index of the median value among the first, middle, and last elements
 * of the sub-array. This strategy helps to choose a better pivot, reducing the
 * likelihood of worst-case O(n²) performance.
 *
 * @param {number[]} arr The array slice.
 * @param {number} low The starting index.
 * @param {number} high The ending index.
 * @returns {number} The index of the element that is the median of the three.
 *
 * @timecomplexity O(1), as it only involves constant-time operations (3 array lookups and comparisons).
 * @spacecomplexity O(1) auxiliary space.
 */
function medianOfThree(arr: number[], low: number, high: number): number {
  // Calculate the index of the middle element.
  const mid = Math.floor((low + high) / 2);

  // Get the values for comparison.
  const a = arr[low];
  const b = arr[mid];
  const c = arr[high];

  // Compare 'a' (low value) to see if it's the median (between 'b' and 'c').
  if ((a >= b && a <= c) || (a <= b && a >= c)) {
    return low;
    // Compare 'b' (mid value) to see if it's the median (between 'a' and 'c').
  } else if ((b >= a && b <= c) || (b <= a && b >= c)) {
    return mid;
    // Otherwise, 'c' (high value) must be the median.
  } else {
    return high;
  }
}
