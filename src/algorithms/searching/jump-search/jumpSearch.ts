/**
 * Searches for a target value within a sorted array of numbers using the Jump Search algorithm.
 *
 * Jump Search performs two phases:
 * 1. Jumping ahead by a fixed block size (square root of the array size).
 * 2. Performing a linear search within the identified block.
 *
 * NOTE: This function assumes the input array (`arr`) is sorted in ascending order.
 *
 * @param {number[]} arr The sorted array of numbers to search through.
 * @param {number} target The value to search for.
 * @returns {number} The index of the target element if found, otherwise -1.
 *
 * @complexity
 * Time Complexity: O(sqrt(n)) - The optimal block size leads to a square root number of jumps and linear steps.
 * Space Complexity: O(1) - Only constant extra space is used for variables.
 */
export function jumpSearch(arr: number[], target: number): number {
  // Get the total number of elements in the array.
  const n = arr.length;

  // --- 1. Handle Edge Case ---
  // If the array is empty, the target cannot be found.
  if (n === 0) return -1;

  // --- 2. Determine Optimal Block Size ---
  // The optimal block size for Jump Search is generally the square root of n (the array size).
  // We use Math.floor to ensure an integer size.
  const blockSize = Math.floor(Math.sqrt(n));

  // 'step' tracks the current end of the block we are examining.
  let step = blockSize;
  // 'prev' tracks the beginning of the current block (where the previous step ended).
  let prev = 0;

  // --- PHASE 1: JUMPING (Block Search) ---
  // Jump ahead until we find a block that might contain the target.
  // We check the last element of the block (arr[step - 1]).
  //
  while (step < n && arr[step - 1] < target) {
    // Save the start of the current block (where we were previously).
    prev = step;
    // Jump to the next block.
    step += blockSize;

    // Safety check: If 'prev' has passed 'n', the target is not in the array.
    // This is optional since the linear search handles it, but adds clarity.
    if (prev >= n) {
      return -1;
    }
  }

  // --- PHASE 2: LINEAR SEARCH (Block Exploration) ---
  // We are now certain the target, if it exists, must be between index 'prev' and 'step'.

  // Perform a standard linear search within this narrowed block.
  // The search must go up to Math.min(step, n) to prevent exceeding the array bounds.
  for (let i = prev; i < Math.min(step, n); i++) {
    if (arr[i] === target) {
      // Target found at index i.
      return i;
    }
  }

  // --- 3. Target Not Found ---
  // If the loop finishes without finding the target.
  return -1;
}
