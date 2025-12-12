// --- Main Function: Exponential Search ---

/**
 * Searches for a target value in a sorted array using Exponential Search.
 *
 * The algorithm works in two phases:
 * 1. Finds a range [i/2, min(i, n-1)] where the target is guaranteed to lie (Expansion Phase).
 * 2. Runs a standard Binary Search within that small range (Binary Search Phase).
 *
 * NOTE: This function assumes the input array (`arr`) is sorted in ascending order.
 *
 * @param {number[]} arr The sorted array of numbers to search through.
 * @param {number} target The value to search for.
 * @returns {number} The index of the target element if found, otherwise -1.
 *
 * @complexity
 * Time Complexity: O(log m), where m is the index of the target element.
 * The total complexity is O(log m) + O(log m) = O(log m).
 * Space Complexity: O(1) - Only constant extra space is used for variables.
 */
export function exponentialSearch(arr: number[], target: number): number {
  const n = arr.length;

  // --- 1. Handle Edge Cases ---
  // Handle empty array
  if (n === 0) return -1;

  // Check if target is at the first position (saves the expansion step if true)
  if (arr[0] === target) return 0;

  // --- 2. Expansion Phase (Range Finding) ---
  // Start the 'i' pointer at index 1.
  let i = 1;

  // Double 'i' repeatedly as long as 'i' is within bounds AND the value at 'i' is less than or equal to the target.
  // This phase finds the smallest power of 2 (let's call it 'i') such that arr[i] is GREATER than the target.
  while (i < n && arr[i] <= target) {
    i *= 2; // Double the search step
  }

  // --- 3. Binary Search Phase ---
  // The target, if it exists, must lie within the range [i / 2, i].
  // Start of range (left): The last position where the condition arr[i] <= target was true (i.e., i/2).
  const rangeStart = i / 2;
  // End of range (right): The current 'i' (the first position where arr[i] > target OR array bounds were hit).
  // Use Math.min(i, n - 1) to ensure the index does not exceed the array's end.
  const rangeEnd = Math.min(i, n - 1);

  // Perform binary search in the now-bounded sub-array.
  return binarySearch(arr, target, rangeStart, rangeEnd);
}

// --- Helper Function: Binary Search (Required for Exponential Search) ---

/**
 * Searches for a target value within a specific bounded sub-array using Binary Search.
 * This is a helper function used internally by exponentialSearch.
 *
 * @private
 * @param {number[]} arr The sorted array.
 * @param {number} target The value to search for.
 * @param {number} left The starting index of the search range.
 * @param {number} right The ending index of the search range.
 * @returns {number} The index of the target element if found, otherwise -1.
 */
function binarySearch(
  arr: number[],
  target: number,
  left: number,
  right: number,
): number {
  // Classic Binary Search loop
  while (left <= right) {
    // Calculate the middle index using the overflow-safe method
    const mid = left + Math.floor((right - left) / 2);

    if (arr[mid] === target) return mid;
    // If mid element is smaller, search the right half
    if (arr[mid] < target) {
      left = mid + 1;
    }
    // If mid element is larger, search the left half
    else {
      right = mid - 1;
    }
  }

  return -1; // Target not found in the bounded range
}
