/**
 * Searches for a target value within a sorted array of numbers using the Binary Search algorithm.
 *
 * NOTE: This function assumes the input array (`arr`) is sorted in ascending order.
 *
 * @param {number[]} arr The sorted array of numbers to search through.
 * @param {number} target The value to search for.
 * @returns {number} The index of the target element if found, otherwise -1.
 *
 * @complexity
 * Time Complexity: O(log n) - The search space is halved in every iteration.
 * Space Complexity: O(1) - Only a few constant-space variables (left, right, mid) are used.
 */
export function binarySearch(arr: number[], target: number): number {
  // --- 1. Handle Edge Cases ---
  // Check if the array is null, undefined, or empty. If so, the target cannot be found.
  if (!arr || arr.length === 0) return -1;

  // --- 2. Initialize Pointers ---
  // 'left' pointer starts at the beginning of the array (index 0).
  let left = 0;
  // 'right' pointer starts at the end of the array (last index).
  let right = arr.length - 1;

  // --- 3. Main Search Loop ---
  // The loop continues as long as the search space is valid (i.e., 'left' hasn't crossed 'right').
  while (left <= right) {
    // --- Calculate the Middle Index (Midpoint) ---
    // This calculation method prevents potential integer overflow compared to (left + right) / 2.
    // Math.floor ensures we get a valid integer index.
    const mid = Math.floor(left + (right - left) / 2);

    // --- Compare and Adjust Search Space ---
    // Case 1: Target found.
    if (arr[mid] === target) {
      return mid; // Return the index where the target was found.
    }
    // Case 2: The middle element is greater than the target.
    else if (arr[mid] > target) {
      // Since the array is sorted, the target (if it exists) must be in the left half.
      // Narrow the search space by moving the 'right' pointer just before the middle.
      right = mid - 1;
    }
    // Case 3: The middle element is less than the target.
    else {
      // Since the array is sorted, the target (if it exists) must be in the right half.
      // Narrow the search space by moving the 'left' pointer just after the middle.
      left = mid + 1;
    }
  }

  // --- 4. Target Not Found ---
  // If the loop finishes, it means 'left' has crossed 'right', and the target was not found
  // within any valid search space.
  return -1;
}
