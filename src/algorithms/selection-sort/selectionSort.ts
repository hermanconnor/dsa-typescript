export function selectionSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const n = arr.length;

  // Outer loop to go through all elements in the array
  for (let i = 0; i < n - 1; i++) {
    let minIndex = i; // Assume the first element is the smallest

    // Inner loop to find the smallest element in the unsorted portion of the array
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j; // Update minIndex if we find a smaller element
      }
    }

    // Swap the smallest element with the first unsorted element
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}
