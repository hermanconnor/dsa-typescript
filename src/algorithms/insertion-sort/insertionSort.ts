/**
 * Sorts an array of numbers using the **Insertion Sort** algorithm.
 * This algorithm builds the final sorted array one item at a time by
 * repeatedly taking the next element and inserting it into its correct
 * position among the elements already sorted.
 *
 * @param {number[]} arr - The array of numbers to be sorted. This array is sorted in-place.
 * @returns {number[]} The reference to the sorted array.
 *
 * @complexity
 * - **Time Complexity (Worst/Average Case):** O(n²)
 * (Occurs when the array is sorted in reverse order, as every element must be
 * compared and shifted past all preceding elements).
 * - **Time Complexity (Best Case):** O(n)
 * (Occurs when the array is already sorted, requiring only one comparison
 * per element).
 * - **Space Complexity:** O(1)
 * (It is an **in-place** sort, only using a constant amount of extra space for
 * temporary variables like `current` and `j`).
 */
export function insertionSort(arr: number[]): number[] {
  // Get the length of the array.
  const n = arr.length;

  // Edge case: An array with 0 or 1 element is already sorted.
  if (n <= 1) return arr;

  // The main loop iterates from the second element (index 1) to the end of the array.
  // The subarray arr[0...i-1] is considered the 'sorted' portion.
  for (let i = 1; i < n; i++) {
    // 'current' holds the element we are trying to insert into the correct
    // position within the sorted subarray arr[0...i-1].
    const current = arr[i];
    // 'j' is the index of the last element in the sorted subarray.
    let j = i - 1;

    // Inner loop: Move elements in the sorted portion that are **greater** than
    // 'current' one position to the right to make space for 'current'.
    while (j >= 0 && arr[j] > current) {
      // Shift the element at arr[j] to the right.
      arr[j + 1] = arr[j];
      // Move to the previous element in the sorted subarray.
      j--;
    }

    // Place the 'current' element into its correct spot.
    // The loop stops when arr[j] is less than or equal to 'current', so the
    // insertion point is at j + 1.
    arr[j + 1] = current;
  }

  // Return the reference to the now-sorted array.
  return arr;
}
