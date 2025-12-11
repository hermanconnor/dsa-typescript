export function binarySearch(arr: number[], target: number): number {
  if (!arr || arr.length === 0) return -1;

  let left = 0;
  let right = arr.length - 1;

  // Keep searching while the search space is valid
  while (left <= right) {
    // Calculate the middle index
    const mid = Math.floor(left + (right - left) / 2);

    // Check if the middle element is the target
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] > target) {
      right = mid - 1; // If target is smaller, search the left half
    } else {
      left = mid + 1; // If target is smaller, search the right half
    }
  }

  // If not found, return -1
  return -1;
}
