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
export function binarySearch<T>(arr: T[], target: T): number {
  if (!arr || arr.length === 0) return -1;

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    // Case 1: Target found.
    if (arr[mid] === target) {
      return mid;
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

  // Loop Finishes: Target Not Found
  return -1;
}
