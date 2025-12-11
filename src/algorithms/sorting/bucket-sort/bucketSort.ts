/**
 * Sorts an array of numbers using the Bucket Sort algorithm.
 * Bucket Sort is most efficient when the input data is uniformly distributed
 * over a range. It typically uses a simpler sort (like Insertion Sort) to
 * sort the elements within each bucket.
 *
 * @param {number[]} arr - The array of numbers to be sorted.
 * @param {number} [bucketCount] - Optional. The number of buckets to use. If not
 * provided, it defaults to Math.floor(Math.sqrt(n)).
 * @returns {number[]} The sorted array.
 *
 * @complexity
 * - **Time Complexity (Worst Case):** O(n²)
 * (Occurs if all elements fall into a single bucket, reducing it to the complexity
 * of the internal sort, e.g., Insertion Sort).
 * - **Time Complexity (Average Case):** O(n + k)
 * (Occurs with uniform distribution, where 'n' is the number of elements and
 * 'k' is the number of buckets, assuming O(1) time for the internal sort).
 * - **Space Complexity:** O(n + k)
 * (Additional space needed to store the 'n' elements in 'k' buckets).
 */
export function bucketSort(arr: number[], bucketCount?: number): number[] {
  const n = arr.length;

  // Edge cases: An array with 0 or 1 element is already sorted.
  if (n <= 1) return arr;

  // Find min and max values to determine the range of the input data.
  let min = arr[0];
  let max = arr[0];

  for (let i = 1; i < n; i++) {
    min = arr[i] < min ? arr[i] : min;
    max = arr[i] > max ? arr[i] : max;
  }

  // If all elements are the same, the array is sorted.
  if (min === max) return arr;

  // Determine optimal bucket count if not provided. Default is often sqrt(n).
  const numBuckets = bucketCount ?? Math.floor(Math.sqrt(n));

  // Initialize buckets: an array of arrays (a 2D array) to hold the numbers.
  // Each inner array represents a single bucket.
  const buckets: number[][] = Array.from({ length: numBuckets }, () => []);

  // Calculate the range of the input and the size/width of each bucket.
  // This determines which bucket an element falls into.
  const range = max - min;
  const bucketSize = range / numBuckets;

  // Distribute elements into buckets
  for (let i = 0; i < n; i++) {
    // Calculate the index for the correct bucket.
    // (arr[i] - min) gives the offset from the minimum value.
    // Dividing by bucketSize gives a fractional index.
    // Math.floor converts it to an integer bucket index (0 to numBuckets - 1).
    let bucketIndex = Math.floor((arr[i] - min) / bucketSize);

    // Safety check: The largest element (max) might calculate to an index equal
    // to numBuckets. We must ensure it falls into the last bucket (numBuckets - 1).
    bucketIndex = Math.min(bucketIndex, numBuckets - 1);

    buckets[bucketIndex].push(arr[i]);
  }

  // Sort individual buckets and concatenate them back into the original array.
  let index = 0; // index to track the current position in the original array 'arr'

  for (let i = 0; i < numBuckets; i++) {
    const bucket = buckets[i];

    // Only process buckets that have elements.
    if (bucket.length > 0) {
      // Sort the elements within the current bucket.
      // Insertion Sort is a common choice due to its efficiency on small,
      // nearly-sorted data sets (which buckets often become).
      insertionSort(bucket);

      // Copy the sorted elements back into the original array 'arr'.
      for (let j = 0; j < bucket.length; j++) {
        arr[index++] = bucket[j];
      }
    }
  }

  // Return the sorted array (which has been sorted in-place).
  return arr;
}

/**
 * Sorts an array of numbers using the Insertion Sort algorithm.
 * This function sorts the array in-place.
 *
 * @param {number[]} arr - The array of numbers to be sorted.
 * @returns {void}
 *
 * @complexity
 * - **Time Complexity (Worst/Average Case):** O(n²)
 * (Occurs when the array is sorted in reverse order, as every element needs to be
 * compared with and potentially shifted past all preceding elements).
 * - **Time Complexity (Best Case):** O(n)
 * (Occurs when the array is already sorted, as only a single comparison is made
 * for each element).
 * - **Space Complexity:** O(1)
 * (It is an in-place sort, only using a constant amount of extra space for
 * temporary variables like 'key' and 'j').
 */
function insertionSort(arr: number[]): void {
  // Get the length of the array.
  const n = arr.length;

  // The main loop iterates from the second element (index 1) to the end of the array.
  // The subarray arr[0...i-1] is always the 'sorted' part.
  for (let i = 1; i < n; i++) {
    // 'key' is the element we want to insert into the correct position
    // within the sorted subarray arr[0...i-1].
    const key = arr[i];
    // 'j' is the index of the last element in the sorted subarray.
    let j = i - 1;

    // Move elements of the sorted subarray, arr[0...i-1], that are
    // greater than 'key' to one position ahead of their current position.
    while (j >= 0 && arr[j] > key) {
      // Shift the element to the right.
      arr[j + 1] = arr[j];
      // Move to the previous element in the sorted subarray.
      j--;
    }

    // Place the 'key' (the original arr[i]) into its correct spot
    // in the sorted portion of the array. The loop stops when arr[j] <= key,
    // so the spot is at j + 1.
    arr[j + 1] = key;
  }
}
