export function linearSearch(arr: number[], target: number): number {
  const n = arr.length;

  // Loop through each element in the array
  for (let i = 0; i < n; i++) {
    // If we find the target, return its index
    if (arr[i] === target) {
      return i;
    }
  }

  // If not found, return -1
  return -1;
}
