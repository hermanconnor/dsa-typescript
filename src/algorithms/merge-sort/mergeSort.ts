export function mergeSort(arr: number[]): number[] {
  // If the array has 1 or 0 elements, it's already sorted
  if (arr.length <= 1) return arr;

  // Step 1: Divide the array into two halves
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle);

  // Step 2: Recursively sort both halves
  return merge(mergeSort(left), mergeSort(right));
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = new Array(left.length + right.length);

  let i = 0;
  let j = 0;
  let k = 0;

  // Merge the two sorted arrays
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result[k] = left[i];
      i++;
    } else {
      result[k] = right[j];
      j++;
    }

    k++;
  }

  // If there are remaining elements in the left array, add them
  while (i < left.length) {
    result[k] = left[i];
    i++;
    k++;
  }

  // If there are remaining elements in the right array, add them
  while (j < right.length) {
    result[k] = right[j];
    j++;
    k++;
  }

  return result;
}
