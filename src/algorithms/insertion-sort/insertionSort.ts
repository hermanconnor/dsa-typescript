export function insertionSort(arr: number[]): number[] {
  if (!arr || !arr.length) return [];

  const n = arr.length;

  // Start from the second element
  for (let i = 1; i < n; i++) {
    const current = arr[i]; // The element we want to insert into the sorted portion
    let j = i - 1;

    // Shift elements of the sorted portion that are greater than current
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--; // Move to the left
    }

    // Insert the current element into its correct position
    arr[j + 1] = current;
  }

  return arr;
}
