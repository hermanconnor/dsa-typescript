export function countingSort(arr: number[]): number[] {
  if (!arr) return [];
  if (arr.length <= 1) return arr;

  const n = arr.length;
  // Find the maximum and minimum elements in the array
  const max = Math.max(...arr);
  const min = Math.min(...arr);

  // Create a count array to count occurrences of each element
  const count = new Array(max - min + 1).fill(0);
  const output = new Array(n);
  const m = count.length;

  // Step 1: Count occurrences
  for (let i = 0; i < n; i++) {
    count[arr[i] - min]++;
  }

  // Step 2: Accumulate the counts
  for (let i = 1; i < m; i++) {
    count[i] += count[i - 1];
  }

  // Step 3: Place the elements in the output array
  for (let i = n - 1; i >= 0; i--) {
    const num = arr[i];
    const index = count[num - min] - 1;

    output[index] = num;
    count[num - min]--;
  }

  return output;
}
