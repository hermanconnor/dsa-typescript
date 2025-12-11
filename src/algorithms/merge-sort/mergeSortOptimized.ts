// Threshold for switching to insertion sort for small subarrays
const INSERTION_SORT_THRESHOLD = 10;

/**
 * Sorts an array of numbers using the **Merge Sort** algorithm (Top-Down, Recursive).
 * This optimized version uses Insertion Sort for small subarrays and skips
 * the merge step if the halves are already sorted. It sorts the array in-place.
 *
 * @param {number[]} arr - The array of numbers to be sorted (sorted in-place).
 * @returns {number[]} The reference to the sorted array.
 *
 * @complexity
 * - **Time Complexity (Worst/Average/Best Case):** O(n \log n)
 * (Merge Sort's dividing and merging process guarantees this performance,
 * regardless of the initial arrangement of the data).
 * - **Space Complexity:** O(n)
 * (Requires O(n) auxiliary space for the `temp` array used during the merge step).
 */
export function mergeSortOptimized(arr: number[]): number[] {
  // Edge case: Array with 0 or 1 element is already sorted.
  if (arr.length <= 1) return arr;

  // Allocate the temporary array once. This prevents repeated memory allocation
  // during the recursive calls, which improves performance.
  const temp = new Array<number>(arr.length);

  // Start the recursive sorting process on the entire array.
  mergeSortHelper(arr, temp, 0, arr.length - 1);

  // Return the reference to the sorted array (which was sorted in-place).
  return arr;
}

/**
 * The recursive helper function for Merge Sort.
 * It divides the array into two halves, recursively sorts them, and then merges the results.
 *
 * @param {number[]} arr - The array being sorted (in-place).
 * @param {number[]} temp - The auxiliary array.
 * @param {number} left - The starting index of the current subarray.
 * @param {number} right - The ending index of the current subarray.
 * @returns {void}
 */
function mergeSortHelper(
  arr: number[],
  temp: number[],
  left: number,
  right: number,
): void {
  // Optimization 1: Switch to Insertion Sort for small subarrays.
  // Insertion Sort has less overhead (function calls, etc.) than Merge Sort,
  // making it faster for small N.
  if (right - left < INSERTION_SORT_THRESHOLD) {
    insertionSort(arr, left, right);
    return;
  }

  // Check if the subarray has more than one element.
  if (left < right) {
    // Calculate the midpoint. The bit shift `>> 1` is a fast way to divide by 2.
    const mid = left + ((right - left) >> 1);

    // Recursively sort the left half.
    mergeSortHelper(arr, temp, left, mid);
    // Recursively sort the right half.
    mergeSortHelper(arr, temp, mid + 1, right);

    // Optimization 2: Skip merge if the halves are already sorted relative to each other.
    // If the largest element of the left half (arr[mid]) is less than or equal to
    // the smallest element of the right half (arr[mid + 1]), they are already merged.
    if (arr[mid] <= arr[mid + 1]) return;

    // Merge the sorted halves back together.
    merge(arr, temp, left, mid, right);
  }
}

/**
 * Merges two sorted subarrays into a single sorted subarray.
 * The two subarrays are arr[left...mid] and arr[mid+1...right].
 * The merging is done by using a temporary array (temp).
 *
 * @param {number[]} arr - The array containing the two sorted halves.
 * @param {number[]} temp - The auxiliary array used for temporary storage.
 * @param {number} left - The starting index of the first subarray.
 * @param {number} mid - The ending index of the first subarray.
 * @param {number} right - The ending index of the second subarray.
 * @returns {void}
 */
function merge(
  arr: number[],
  temp: number[],
  left: number,
  mid: number,
  right: number,
): void {
  // Copy left half (arr[left] to arr[mid]) to the temp array normally.
  for (let i = left; i <= mid; i++) {
    temp[i] = arr[i];
  }

  // Copy right half (arr[mid+1] to arr[right]) to the temp array **in reverse order**.
  // This setup simplifies the final merge loop:
  // - The smallest element of the left half is at temp[left].
  // - The largest element of the right half is at temp[mid + 1].
  // - The largest element of the left half is at temp[mid].
  // - The smallest element of the right half is at temp[right].
  for (let i = mid + 1; i <= right; i++) {
    // The index calculation ensures the right half is copied backwards.
    temp[right - i + mid + 1] = arr[i];
  }

  // Pointers for the merge process:
  // 'i' starts at the beginning of the *forward-copied* left half.
  let i = left;
  // 'j' starts at the beginning of the *reverse-copied* right half (which is the smallest element).
  let j = right;

  // Merge back to the original array 'arr'.
  for (let k = left; k <= right; k++) {
    // Since the right half is reversed, comparing temp[i] (smallest element of left)
    // with temp[j] (smallest element of right) simplifies the check:
    if (temp[i] <= temp[j]) {
      // Take the element from the left half and advance its pointer.
      arr[k] = temp[i++];
    } else {
      // Take the element from the right half and move its pointer backwards.
      arr[k] = temp[j--];
    }
  }
}

/**
 * Insertion Sort for sorting small subarrays within Merge Sort.
 * It sorts the portion of the array from index 'left' to 'right' (inclusive) in-place.
 * Insertion Sort is highly efficient for small 'n'.
 *
 * @param {number[]} arr - The main array being sorted.
 * @param {number} left - The starting index of the subarray to sort.
 * @param {number} right - The ending index of the subarray to sort.
 * @returns {void}
 */
function insertionSort(arr: number[], left: number, right: number): void {
  // Iterate through the subarray starting from the second element (left + 1).
  for (let i = left + 1; i <= right; i++) {
    // 'key' is the element to be inserted into the sorted portion (arr[left...i-1]).
    const key = arr[i];
    // 'j' points to the last element of the sorted portion.
    let j = i - 1;

    // Shift elements in the sorted portion that are greater than 'key' to the right.
    while (j >= left && arr[j] > key) {
      // Shift element one position to the right.
      arr[j + 1] = arr[j];
      // Move to the previous element.
      j--;
    }

    // Insert 'key' into its correct position.
    arr[j + 1] = key;
  }
}
