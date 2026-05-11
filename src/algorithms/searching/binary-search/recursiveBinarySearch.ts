/**
 * Recursively searches for a target in a sorted array.
 * @param arr - The sorted array to search.
 * @param target - The value to find.
 * @param left - The starting index of the current range.
 * @param right - The ending index of the current range.
 * @returns The index of the target, or -1 if not found.
 */
export function recursiveBinarySearch<T>(
  arr: T[],
  target: T,
  left: number = 0,
  right: number = arr.length - 1,
): number {
  // Base Case: If the left index exceeds the right, the target isn't here
  if (left > right) {
    return -1;
  }

  // Calculate the middle index
  const mid = Math.floor(left + (right - left) / 2);

  // Case 1: Found the target
  if (arr[mid] === target) {
    return mid;
  }

  // Case 2: Target is smaller than the middle element
  // Search the left half
  if (target < arr[mid]) {
    return recursiveBinarySearch(arr, target, left, mid - 1);
  }

  // Case 3: Target is larger than the middle element
  // Search the right half
  return recursiveBinarySearch(arr, target, mid + 1, right);
}
