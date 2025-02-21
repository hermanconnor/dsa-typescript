export function exponentialSearch(arr: number[], target: number): number {
  const n = arr.length;

  // Step 1: If the array is empty, return -1
  if (n === 0) return -1;

  // Step 2: Check if the first element is the target
  if (arr[0] === target) return 0;

  // Step 3: Find the range where the element might be
  let index = 1;

  while (index < n && arr[index] < target) {
    index *= 2; // Exponentially increasing the index
  }

  // Step 4: Perform binary search on the found range
  let left = index / 2;
  let right = Math.min(index, n - 1);

  while (left <= right) {
    const mid = Math.floor(left + (right - left) / 2);

    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  // Target not found
  return -1;
}
