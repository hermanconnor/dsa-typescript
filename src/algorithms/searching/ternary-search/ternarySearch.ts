/**
 * Searches for a target value within a sorted array of numbers using the Ternary Search algorithm.
 *
 * Ternary Search works by dividing the search space into three approximately equal parts
 * and eliminating two-thirds of the elements in each step.
 *
 * NOTE: Ternary search has a theoretical complexity slightly worse than Binary Search (due to more comparisons per step)
 * for searching sorted arrays, making Binary Search the preferred choice.
 * NOTE: This function assumes the input array (`arr`) is sorted in ascending order.
 *
 * @param {number[]} arr The sorted array of numbers to search through.
 * @param {number} target The value to search for.
 * @returns {number} The index of the target element if found, otherwise -1.
 *
 * @complexity
 * Time Complexity: O(log base 3 of n) or O(log n) - The search space is reduced by a factor of 3 in each iteration.
 * Space Complexity: O(1) - Only constant extra space is used for variables.
 */
export function ternarySearch(arr: number[], target: number): number {
  // --- 1. Initialize Pointers ---
  // 'left' pointer starts at the beginning of the array.
  let left = 0;
  // 'right' pointer starts at the end of the array.
  let right = arr.length - 1;

  // --- 2. Main Search Loop ---
  // The loop continues as long as the search space is valid.
  while (left <= right) {
    // --- Calculate the Two Midpoints ---
    // The search space [left, right] is divided into three parts:
    // [left, mid1 - 1], [mid1 + 1, mid2 - 1], [mid2 + 1, right]

    // mid1: Marks the end of the first third of the array.
    // Calculation: left + (1/3) * (size of search space)
    const mid1 = Math.floor(left + (right - left) / 3);

    // mid2: Marks the end of the second third of the array.
    // Calculation: left + (2/3) * (size of search space)
    const mid2 = Math.floor(left + (2 * (right - left)) / 3);

    // --- Case A: Check Midpoints for Target ---
    if (arr[mid1] === target) return mid1; // Target found at the first midpoint.

    if (arr[mid2] === target) return mid2; // Target found at the second midpoint.

    // --- Case B: Determine the New Search Space ---
    // The target is compared against the values at mid1 and mid2 to eliminate 2/3 of the elements.

    // Target is in the first third: arr[left] to arr[mid1 - 1]
    if (target < arr[mid1]) {
      // Eliminate the middle and right sections.
      right = mid1 - 1;
    }
    // Target is in the last third: arr[mid2 + 1] to arr[right]
    else if (target > arr[mid2]) {
      // Eliminate the left and middle sections.
      left = mid2 + 1;
    }
    // Target is in the middle third: arr[mid1 + 1] to arr[mid2 - 1]
    else {
      // Eliminate the outer sections (first and last thirds).
      left = mid1 + 1;
      right = mid2 - 1;
    }
  }

  // --- 3. Target Not Found ---
  // If the loop finishes, the search space is exhausted.
  return -1;
}
