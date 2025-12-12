/**
 * Implements Radix Sort using base-10 (decimal) Counting Sort passes.
 * This is a general-purpose, stable, least significant digit (LSD) Radix Sort.
 *
 * It is generally less performant than base-256 for standard 32-bit integers,
 * but it serves as a clear illustration of the algorithm.
 *
 * @param {number[]} arr The array of non-negative integers to be sorted.
 * @returns {number[]} The sorted array.
 * @complexity Time: O(K * N), where N is the number of elements and K is the
 * maximum number of digits (base-10). More precisely O(K * (N + B))
 * where B is the radix (here B=10).
 * @complexity Space: O(N + B) for the output and count arrays.
 */
export function radixSort(arr: number[]): number[] {
  const n = arr.length;
  // Base case: arrays of length 0 or 1 are already sorted.
  if (n <= 1) return arr;

  // --- 1. Find the maximum element to determine the number of passes (K) ---
  // Finds max without spread operator (avoids 'Maximum call stack size exceeded' on very large arrays)
  let max = arr[0];
  for (let i = 1; i < n; i++) {
    if (arr[i] > max) max = arr[i];
  }

  // Output array to hold the elements after each Counting Sort pass.
  let output = new Array(n);
  // Count array (size 10 for base-10 digits 0-9).
  const count = new Array(10);

  // Use configurable radix for better understanding (here, we use 10 for decimal)
  const radix = 10;

  // --- 2. Iterate through each digit (pass) from LSD to MSD ---
  // exp starts at 1 (units place), 10 (tens place), 100 (hundreds place), etc.
  // The loop continues as long as there is a significant digit remaining (max / exp > 0).
  for (let exp = 1; Math.floor(max / exp) > 0; exp *= radix) {
    // Reset count array for the current digit pass
    count.fill(0);

    // --- 2a. Counting Phase ---
    // Count occurrences of each digit (0-9) at the current 'exp' position.
    for (let i = 0; i < n; i++) {
      // Formula to extract the digit: (arr[i] / exp) % radix
      const digit = Math.floor(arr[i] / exp) % radix;
      count[digit]++;
    }

    // --- 2b. Cumulative Count Phase ---
    // Compute cumulative count (prefix sum). This converts counts into
    // starting positions for the elements in the output array.
    for (let i = 1; i < radix; i++) {
      count[i] += count[i - 1];
    }

    // --- 2c. Placement Phase ---
    // Build the output array using the stable Counting Sort logic.
    // Iterate backwards to maintain stability (elements with the same digit keep their relative order).
    for (let i = n - 1; i >= 0; i--) {
      const digit = Math.floor(arr[i] / exp) % radix;
      // The position is count[digit] - 1. Decrementing pre-emptively is a common optimization.
      output[--count[digit]] = arr[i];
    }

    // Swap arrays instead of copying (more efficient than arr = output.slice(0)).
    // 'arr' now holds the partially sorted result, and 'output' becomes the next scratchpad.
    [arr, output] = [output, arr];
  }

  // The result is in 'arr' because of the final swap.
  return arr;
}
