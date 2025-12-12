import { radixSort } from './radixSort';

/**
 * Radix Sort implementation that handles both positive and negative integers.
 *
 * It works by separating the array into non-negative and negative components,
 * sorting them independently, and then merging the results.
 * For negative numbers, it sorts the absolute values and then negates/reverses
 * the order (since -5 is smaller than -2, but its absolute value 5 is greater than 2).
 *
 * @param {number[]} arr The array of integers (positive and negative) to be sorted.
 * @returns {number[]} The sorted array.
 * @complexity Time: O(K * N), dominated by the two internal Radix Sort calls.
 * @complexity Space: O(N) for the split arrays and the internal working arrays of radixSort.
 */
export function radixSortWithNegatives(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const positive: number[] = [];
  const negative: number[] = [];

  // --- 1. Split array into positive and negative numbers ---
  for (const num of arr) {
    if (num >= 0) positive.push(num);
    else negative.push(-num); // Store absolute value of negative numbers
  }

  // --- 2. Sort positive numbers ---
  // The standard radixSort works directly on non-negative numbers.
  const sortedPositive = positive.length > 0 ? radixSort(positive) : [];

  // --- 3. Sort and adjust negative numbers ---
  let sortedNegative: number[] = [];
  if (negative.length > 0) {
    // Sort the absolute values of the negative numbers.
    sortedNegative = radixSort(negative);

    // Negate the numbers back: [1, 5, 10] becomes [-1, -5, -10]
    for (let i = 0; i < sortedNegative.length; i++) {
      sortedNegative[i] = -sortedNegative[i];
    }

    // Reverse the array: [-1, -5, -10] must become [-10, -5, -1]
    // because the smaller absolute value corresponds to the larger (less negative) number.
    sortedNegative.reverse();
  }

  // --- 4. Merge results ---
  // Negative numbers (smallest) followed by positive numbers (largest).
  // Use concat instead of spread for better performance on potentially large arrays.
  return sortedNegative.concat(sortedPositive);
}
