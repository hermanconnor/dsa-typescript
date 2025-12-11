/**
 * Sorts an array of integers using the **Counting Sort** algorithm.
 * Counting sort is most efficient when the range of input values (k) is
 * not much larger than the number of elements (n). It is a non-comparative sort
 * and is **stable** (maintains the relative order of equal elements).
 *
 * @param {number[]} arr - The array of non-negative integers to be sorted.
 * @returns {number[]} A new, sorted array.
 *
 * @complexity
 * - **Time Complexity (Worst/Average/Best Case):** O(n + k)
 * (Where 'n' is the number of elements and 'k' is the range of input values (max - min)).
 * - **Space Complexity:** O(n + k)
 * (Requires O(k) for the `count` array and O(n) for the `output` array).
 */
export function countingSort(arr: number[]): number[] {
  const n = arr.length;

  // Edge case: If array has 0 or 1 element, it is already sorted.
  // Note: Returns a *new copy* ([...arr]) to maintain the function's
  // contract of returning a new array, even in the base case.
  if (n <= 1) return [...arr];

  // --- Step 1: Find min and max to determine the range (k) ---
  let min = arr[0];
  let max = arr[0];

  for (let i = 1; i < n; i++) {
    min = arr[i] < min ? arr[i] : min;
    max = arr[i] > max ? arr[i] : max;
  }

  // Calculate the total number of unique values/bins needed for the count array.
  const range = max - min + 1;

  // --- Step 2: Count occurrences of each value ---
  // Create an array to store the counts, indexed by (value - min).
  const count = new Array(range).fill(0);

  for (let i = 0; i < n; i++) {
    // Increment the counter for the value at the appropriate index.
    count[arr[i] - min]++;
  }

  // --- Step 3: Transform count array to cumulative positions ---
  // This step ensures stability and tells us the final starting position
  // for elements with that value in the sorted array.
  for (let i = 1; i < range; i++) {
    // count[i] now stores the total number of elements less than or equal to i + min.
    count[i] += count[i - 1];
  }

  // --- Step 4: Build output array (iterate backwards for stability) ---
  const output = new Array(n);

  // Iterate backwards through the original array. This is crucial for **stability**.
  for (let i = n - 1; i >= 0; i--) {
    const val = arr[i];
    const valIndexInCount = val - min;

    // The current count[valIndexInCount] is the **position AFTER** the value
    // should be placed. Decrementing it gives the correct final index (pos).
    const pos = --count[valIndexInCount];

    // Place the value into the calculated final position in the output array.
    output[pos] = val;
  }

  // Counting Sort creates and returns a brand new sorted array.
  return output;
}
