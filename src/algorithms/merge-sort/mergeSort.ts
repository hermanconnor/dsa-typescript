/**
 * Sorts an array of numbers using the Merge Sort algorithm.
 * * Merge Sort is a **Divide and Conquer** algorithm. It works by recursively
 * breaking down the array into two halves until it has arrays with one element
 * or fewer (which are inherently sorted). Then, it **merges** the smaller
 * sorted arrays back together to produce a final sorted array.
 * * **Time Complexity:**
 * - **Best Case:** O(n log n)
 * - **Average Case:** O(n log n)
 * - **Worst Case:** O(n log n)
 * * **Space Complexity:**
 * - **Worst Case:** O(n) (due to the auxiliary array used during the merge step)
 * * @param {number[]} arr The array of numbers to be sorted.
 * @returns {number[]} A new array containing the sorted numbers.
 */
export function mergeSort(arr: number[]): number[] {
  // Base case: An array with 0 or 1 elements is considered sorted.
  if (arr.length <= 1) return arr;

  // 1. **Divide**
  // Find the middle index to split the array.
  const middle = Math.floor(arr.length / 2);

  // Create the left half of the array.
  const left = arr.slice(0, middle);

  // Create the right half of the array.
  const right = arr.slice(middle);

  // 2. **Conquer and Combine**
  // Recursively sort the left and right halves, and then merge the two sorted results.
  return merge(mergeSort(left), mergeSort(right));
}

/**
 * Merges two already sorted arrays into a single, new sorted array.
 * * This is the **Combine** step of the Merge Sort algorithm. It iterates through
 * both arrays simultaneously, comparing elements and adding the smaller one
 * to the result array.
 * * **Time Complexity:**
 * - **Worst Case:** O(n), where n is the total number of elements in both arrays
 * (left.length + right.length), as every element is processed exactly once.
 * * **Space Complexity:**
 * - **Worst Case:** O(n) for the creation of the new result array.
 * * @param {number[]} left The first sorted array.
 * @param {number[]} right The second sorted array.
 * @returns {number[]} A new array containing all elements from both inputs, sorted.
 */
function merge(left: number[], right: number[]): number[] {
  // Create a new array to hold the merged, sorted result. The size is the sum
  // of the lengths of the two input arrays.
  const result: number[] = new Array(left.length + right.length);

  // Initialize pointers/indices for the left array (i), right array (j),
  // and the result array (k).
  let i = 0; // Pointer for the left array
  let j = 0; // Pointer for the right array
  let k = 0; // Pointer for the result array

  // Loop while there are still elements to compare in *both* arrays.
  while (i < left.length && j < right.length) {
    // Compare the current elements in the left and right arrays.
    if (left[i] <= right[j]) {
      // If the left element is smaller (or equal), add it to the result.
      result[k] = left[i];
      i++; // Move the left array pointer forward.
    } else {
      // Otherwise, the right element is smaller, so add it to the result.
      result[k] = right[j];
      j++; // Move the right array pointer forward.
    }

    k++; // Always move the result array pointer forward.
  }

  // **Handle Remaining Elements (Cleanup)**
  // At this point, one of the arrays has been exhausted. Copy the remaining elements
  // from the other array, which are already sorted.

  // Copy any remaining elements from the left array.
  while (i < left.length) {
    result[k] = left[i];
    i++;
    k++;
  }

  // Copy any remaining elements from the right array.
  while (j < right.length) {
    result[k] = right[j];
    j++;
    k++;
  }

  // Return the fully merged and sorted array.
  return result;
}
