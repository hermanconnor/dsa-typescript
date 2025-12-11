export function bubbleSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const n = arr.length;
  let swapped;

  // Outer loop: iterate through all elements
  for (let i = 0; i < n - 1; i++) {
    swapped = false;
    // Inner loop: compare adjacent elements
    for (let j = 0; j < n - 1 - i; j++) {
      // After each pass, the largest element is in its final position, so reduce the range
      if (arr[j] > arr[j + 1]) {
        // Swap elements if they are in the wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // If no elements were swapped, array is already sorted, break early
    if (!swapped) break;
  }

  return arr;
}
