export function bucketSort(arr: number[]): number[] {
  const n = arr.length;
  if (n <= 1) return arr; // If the array has one or no elements, it's already sorted

  // Find the min and max values in the array
  const minValue = Math.min(...arr);
  const maxValue = Math.max(...arr);

  // Edge case: if all elements are the same (minValue == maxValue)
  if (minValue === maxValue) return arr;

  // Calculate bucketCount, you can adjust this to a fixed number if desired
  const bucketCount = n;

  // Create empty buckets
  const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

  // Normalize the array values into the range 0 to 1 and distribute them into the buckets
  for (let i = 0; i < n; i++) {
    // Normalize the values to be in the range 0 to 1 for bucket sorting
    const normalizedValue = (arr[i] - minValue) / (maxValue - minValue);
    const index = Math.min(
      Math.floor(normalizedValue * bucketCount),
      bucketCount - 1,
    );

    buckets[index].push(arr[i]);
  }

  // Sort each bucket (using insertion sort or any other stable sort)
  for (let i = 0; i < bucketCount; i++) {
    buckets[i].sort((a, b) => a - b);
  }

  // Concatenate the buckets to get the final sorted array
  return buckets.flat();
}
