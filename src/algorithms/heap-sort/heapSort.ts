// Max-Heapify function
function heapify(arr: number[], n: number, i: number): void {
  let largest = i; // Initialize largest as root
  const left = 2 * i + 1; // left child
  const right = 2 * i + 2; // right child

  // Check if left child exists and is larger than root
  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  // Check if right child exists and is larger than largest
  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  // If largest is not root, swap it with the largest and heapify the affected subtree
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]]; // Swap
    heapify(arr, n, largest); // Recursively heapify the affected subtree
  }
}

export function heapSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const n = arr.length;

  // Build max-heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    // Swap the root (maximum element) with the last element
    [arr[0], arr[i]] = [arr[i], arr[0]];

    // Call heapify on the reduced heap
    heapify(arr, i, 0);
  }

  return arr;
}
