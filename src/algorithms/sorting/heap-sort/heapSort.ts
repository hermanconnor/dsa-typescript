// Threshold for switching to insertion sort
// For small arrays, the overhead of heap operations is not worth it,
// and Insertion Sort's lower overhead and better constant factors make it faster.
const INSERTION_SORT_THRESHOLD = 16;

/**
 * Sorts an array of numbers using the Heap Sort algorithm.
 * * Heap Sort is an in-place, unstable comparison sort. It uses the concept of a Max-Heap.
 * * Time Complexity: O(n log n)
 * - Building the heap (first phase): O(n)
 * - Sorting (second phase, n extractions): n * O(log n) = O(n log n)
 * * Space Complexity: O(1)
 * - It's an in-place sort, meaning it only uses a constant amount of extra memory for variables.
 * * @param arr The array of numbers to be sorted.
 * @returns The sorted array (the input array is sorted in place).
 */
export function heapSort(arr: number[]): number[] {
  // Get the size of the array
  const n = arr.length;

  // --- Optimization: Hybrid Sort for small arrays ---
  // Use insertion sort for small arrays, as it performs better due to lower overhead
  // and better cache locality compared to Heap Sort's complex structure for small N.
  if (n <= INSERTION_SORT_THRESHOLD) {
    return insertionSort(arr);
  }

  // --- Phase 1: Build Max Heap ---
  // A Max Heap ensures that the largest element is always at the root (index 0).
  // This phase takes O(n) time.
  // We start from the last non-leaf node, which is at index floor(n/2) - 1.
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    // Apply heapify to the subtree rooted at index i
    heapify(arr, n, i);
  }
  //

  // --- Phase 2: Extract elements one by one and sort ---
  // After the heap is built, we repeatedly extract the largest element (root)
  // and place it at the end of the array, then re-heapify the remaining elements.
  // This phase takes O(n log n) time.
  for (let i = n - 1; i > 0; i--) {
    // 1. Move current root (largest element) to the end of the unsorted section
    // The current root (arr[0]) is the largest element in the heap.
    // The element at arr[i] is the end of the *unsorted* part of the array.
    const temp = arr[0];
    arr[0] = arr[i];
    arr[i] = temp; // Element at arr[i] is now correctly placed.

    // 2. Heapify the reduced heap (size 'i')
    // The element swapped into the root (arr[0]) might violate the max-heap property.
    // We call heapify on the remaining array (up to index i-1) starting from the root (index 0).
    heapify(arr, i, 0);
  }

  return arr;
}

/**
 * Restores the max-heap property in a subtree rooted at index `i`.
 * * In the context of Heap Sort, this is called during the 'Build Heap' phase
 * and the 'Extract Elements' phase.
 * * Time Complexity: O(log n)
 * - In the worst case, the element at root 'i' must trickle down to a leaf node.
 * - The height of a heap is log n, so this operation takes time proportional to the height.
 * * @param arr The array representing the heap.
 * @param n The size of the heap (the number of elements to consider in the array).
 * @param i The index of the root of the subtree to heapify.
 */
function heapify(arr: number[], n: number, i: number): void {
  // Use a 'while (true)' loop for an iterative (non-recursive) heapify process,
  // which generally has lower overhead.
  while (true) {
    let largest = i; // Initialize largest as root
    const left = 2 * i + 1; // Left child index
    const right = 2 * i + 2; // Right child index

    // Check if the left child exists and is greater than the current largest
    if (left < n && arr[left] > arr[largest]) {
      largest = left;
    }

    // Check if the right child exists and is greater than the current largest
    // (which might be the left child from the step above)
    if (right < n && arr[right] > arr[largest]) {
      largest = right;
    }

    // If the root is still the largest, the max-heap property is satisfied in this subtree.
    if (largest === i) break;

    // A child is larger than the root: swap them.
    // Swap arr[i] (current root) with arr[largest] (the new root)
    const temp = arr[i];
    arr[i] = arr[largest];
    arr[largest] = temp;

    // Continue the process for the subtree that was affected by the swap.
    // The element we just moved down to 'largest' might now violate the heap property there.
    i = largest;
  }
}

/**
 * Sorts a small array of numbers using the Insertion Sort algorithm.
 * * Used here as an optimization for small arrays, where it is faster than Heap Sort.
 * * Time Complexity: O(n²) (Worst and Average case) | O(n) (Best case: already sorted)
 * Space Complexity: O(1) (In-place sort)
 * * @param arr The small array of numbers to be sorted.
 * @returns The sorted array (the input array is sorted in place).
 */
function insertionSort(arr: number[]): number[] {
  // Start from the second element (index 1) and move to the end
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i]; // The element we are trying to insert into the sorted subarray
    let j = i - 1; // Start comparison with the element just before the key

    // Shift elements in the sorted subarray (0 to i-1) that are greater than 'key'
    // to the right by one position, creating a spot for 'key'.
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    // Insert the 'key' into its correct position in the sorted subarray
    arr[j + 1] = key;
  }

  return arr;
}
