export function quickSort(arr: number[]): number[] {
  const quickSortHelper = (low: number, high: number): void => {
    if (low < high) {
      const pivotIndex = partition(arr, low, high); // Partition the array

      // Recursively sort the subarrays
      quickSortHelper(low, pivotIndex - 1);
      quickSortHelper(pivotIndex + 1, high);
    }
  };

  quickSortHelper(0, arr.length - 1);

  return arr;
}

function partition(arr: number[], low: number, high: number): number {
  const pivot = medianOfThree(arr, low, high);
  const pivotValue = arr[pivot];

  // Swap the pivot with the last element
  [arr[pivot], arr[high]] = [arr[high], arr[pivot]];

  let i = low - 1;

  // Rearrange the array, putting elements less than pivot on the left
  // and elements greater than pivot on the right
  for (let j = low; j < high; j++) {
    if (arr[j] < pivotValue) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap
    }
  }

  // Place the pivot element in the correct position
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];

  return i + 1;
}

// Helper function to choose a pivot using the median of three strategy
/**
 Median of Three Pivot: Choose the pivot as the median of the first, middle, and last elements. This can improve performance by avoiding unbalanced partitions in many cases.
 */
function medianOfThree(arr: number[], low: number, high: number): number {
  const mid = Math.floor((low + high) / 2);
  const a = arr[low];
  const b = arr[mid];
  const c = arr[high];

  // Return the index of the median value
  if (a > b !== a > c) {
    return low;
  } else if (b > a !== b > c) {
    return mid;
  } else {
    return high;
  }
}
